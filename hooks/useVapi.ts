
import { useEffect, useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { TranscriptItem } from '@/components/TranscriptPanel';
import { api } from '@/lib/api';

type VapiStatus = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

const DEVANAGARI_REGEX = /[\u0900-\u097F]/;
const LEADING_SHORT_LATIN_WORD_BEFORE_DEVANAGARI = /^[A-Za-z]{1,4}\s+(?=[\u0900-\u097F])/;

const sanitizeTranscriptText = (rawText: string) => {
  const trimmed = rawText.trim();
  if (!trimmed) return '';

  // Common STT glitch for mixed language input:
  // a short random Latin token appears right before Marathi (Devanagari) words.
  if (DEVANAGARI_REGEX.test(trimmed)) {
    return trimmed.replace(LEADING_SHORT_LATIN_WORD_BEFORE_DEVANAGARI, '').trim();
  }

  return trimmed;
};

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
        const cleanedTranscript = sanitizeTranscriptText(message.transcript || '');
        if (!cleanedTranscript) return;

        setTranscript((prev) => {
          // Check if the last message is exactly the same as the new one
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === message.role && lastMsg.text === cleanedTranscript) {
            return prev; // Duplicate found, ignore it
          }
          // If unique, add it
          return [
            ...prev,
            { role: message.role, text: cleanedTranscript },
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
      vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '', {
        assistantOverrides: {
          transcriber: {
            language: 'multi',
          },
        },
      } as any);
    }
  }, [isSessionActive]);

  return { status, isSessionActive, transcript, toggleCall };
};
