// import { useEffect, useState, useCallback } from 'react';
// import Vapi from '@vapi-ai/web';
// import { TranscriptItem } from '@/components/TranscriptPanel';
// import { api } from '@/lib/api'; // Import your API helper to save data

// // Define the Vapi Agent Status types
// type VapiStatus = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

// // Initialize Vapi outside component to avoid re-creation on re-renders
// const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

// export const useVapi = () => {
//   const [status, setStatus] = useState<VapiStatus>('disconnected');
//   const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
//   const [isSessionActive, setIsSessionActive] = useState(false);

//   useEffect(() => {
//     // 1. Handle Call Start
//     const onCallStart = () => {
//       setStatus('listening');
//       setIsSessionActive(true);
//       setTranscript([]); // Reset transcript on new call
//     };

//     // 2. Handle Call End
//     const onCallEnd = () => {
//       setStatus('disconnected');
//       setIsSessionActive(false);
//     };

//     // 3. Handle Speech Status (Listening vs Speaking)
//     const onSpeechStart = () => setStatus('listening'); 
//     const onSpeechEnd = () => setStatus('thinking');

//     // 4. Handle Real-time Messages (Transcripts & Tool Calls)
//     const onMessage = async (message: any) => {
//       // Handle Speech Update (Animation triggers)
//       if (message.type === 'speech-update') {
//         if (message.status === 'started') setStatus('speaking');
//         if (message.status === 'stopped') setStatus('listening');
//       }

//       // Handle Transcripts
//       if (message.type === 'transcript' && message.transcriptType === 'final') {
//         setTranscript((prev) => [
//           ...prev,
//           {
//             role: message.role, // 'user' or 'assistant'
//             text: message.transcript,
//           },
//         ]);
//       }

//       // --- THE NEW PART: HANDLE TOOL CALLS ---
//       // This detects when the AI wants to run the 'createListing' tool
//       console.log("Received Message Type:", message.type); // <--- ADD THIS
    
//     if (message.type === 'function-call') {              // <--- ADD THIS CHECK
//         console.log("FUNCTION CALL DETECTED!", message); 
//     }
//       if (message.type === 'function-call' && message.functionCall.name === 'createListing') {
//         const { crop, quantity, price, location } = message.functionCall.parameters;
        
//         console.log("AI is creating a listing:", { crop, quantity, price, location });

//         // Optional: Add a temporary system message to UI so user sees something is happening
//         setTranscript(prev => [...prev, { role: 'assistant', text: `Creating listing for ${crop}...` }]);

//         // Call your Spring Boot Backend via our API helper
//         const result = await api.createListing({
//             crop,
//             quantity,
//             price,
//             location,
//             source: 'voice'
//         });

//         if (result) {
//             console.log("Listing successfully saved to MongoDB:", result);
//             // You could add a success message to the transcript here if you want
//         } else {
//             console.error("Failed to save listing via Voice.");
//         }
//       }
//     };

//     // 5. Handle Errors
//     const onError = (e: any) => {
//       console.error('Vapi Error:', e);
//       setStatus('disconnected');
//       setIsSessionActive(false);
//     };

//     // Attach Listeners
//     vapi.on('call-start', onCallStart);
//     vapi.on('call-end', onCallEnd);
//     vapi.on('speech-start', onSpeechStart);
//     vapi.on('speech-end', onSpeechEnd);
//     vapi.on('message', onMessage);
//     vapi.on('error', onError);

//     // Cleanup
//     return () => {
//       vapi.removeAllListeners();
//     };
//   }, []);

//   const toggleCall = useCallback(() => {
//     if (isSessionActive) {
//       vapi.stop();
//     } else {
//       setStatus('connecting');
//       vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '');
//     }
//   }, [isSessionActive]);

//   return { status, isSessionActive, transcript, toggleCall };
// };
import { useEffect, useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { TranscriptItem } from '@/components/TranscriptPanel';
import { api } from '@/lib/api';

type VapiStatus = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export const useVapi = () => {
  const [status, setStatus] = useState<VapiStatus>('disconnected');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // Ref to track processed tool calls and prevent duplicates
  const processedCallIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onCallStart = () => {
      setStatus('listening');
      setIsSessionActive(true);
      setTranscript([]);
      processedCallIds.current.clear(); // Clear history on new call
    };

    const onCallEnd = () => {
      setStatus('disconnected');
      setIsSessionActive(false);
    };

    const onSpeechStart = () => setStatus('listening'); 
    const onSpeechEnd = () => setStatus('thinking');

    const onMessage = async (message: any) => {
      // 1. --- FIXED: Handle Transcripts with Deduplication ---
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript((prev) => {
          // Check if the last message is exactly the same as the new one
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === message.role && lastMsg.text === message.transcript) {
            return prev; // Duplicate found, ignore it
          }
          // If unique, add it
          return [
            ...prev,
            { role: message.role, text: message.transcript },
          ];
        });
      }

      // 2. Handle Speech Updates (Animation)
      if (message.type === 'speech-update') {
        if (message.status === 'started') setStatus('speaking');
        if (message.status === 'stopped') setStatus('listening');
      }

      // 3. Handle 'tool-calls' (Function execution)
      if (message.type === 'tool-calls') {
        console.log("🛠️ Tool Call Detected:", message);

        for (const toolCall of message.toolCallList) {
            
            // DEDUPLICATION: Check if we already ran this specific ID
            if (processedCallIds.current.has(toolCall.id)) {
                console.log("⚠️ Skipping duplicate tool call:", toolCall.id);
                continue;
            }

            if (toolCall.function.name === 'createListing') {
                // Mark as processing immediately
                processedCallIds.current.add(toolCall.id);

                // Parse arguments
                let args = toolCall.function.arguments;
                if (typeof args === 'string') {
                    args = JSON.parse(args);
                }

                const { crop, quantity, price, location } = args;
                
                // UI Feedback (Optional)
                setTranscript(prev => [...prev, { role: 'assistant', text: `Processing listing for ${crop}...` }]);

                try {
                    // Call Backend
                    const result = await api.createListing({
                        crop,
                        quantity,
                        price,
                        location,
                        source: 'voice'
                    });
                    
                    console.log("✅ API SUCCESS:", result);
                    
                    // Send result back to Vapi
                    vapi.send({
                      type: "tool-output",
                      toolCallList: [
                        {
                          id: toolCall.id,
                          result: "Listing created successfully. Tell the user it is done."
                        }
                      ]
                    } as any);

                } catch (error) {
                    console.error("❌ API FAILED:", error);
                }
            }
        }
      }
    };

    const onError = (e: any) => {
      console.error('Vapi Error:', e);
      setStatus('disconnected');
      setIsSessionActive(false);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const toggleCall = useCallback(() => {
    if (isSessionActive) {
      vapi.stop();
    } else {
      setStatus('connecting');
      vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '');
    }
  }, [isSessionActive]);

  return { status, isSessionActive, transcript, toggleCall };
};