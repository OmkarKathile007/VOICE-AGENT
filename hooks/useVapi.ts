import { useEffect, useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { TranscriptItem } from '@/components/TranscriptPanel';

// Define the Vapi Agent Status types
type VapiStatus = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');

export const useVapi = () => {
  const [status, setStatus] = useState<VapiStatus>('disconnected');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    // 1. Handle Call Start
    const onCallStart = () => {
      setStatus('listening');
      setIsSessionActive(true);
      setTranscript([]); // Reset transcript on new call
    };

    // 2. Handle Call End
    const onCallEnd = () => {
      setStatus('disconnected');
      setIsSessionActive(false);
    };

    // 3. Handle Speech Status (Listening vs Speaking)
    const onSpeechStart = () => setStatus('listening'); 
    const onSpeechEnd = () => setStatus('thinking');

    // 4. Handle Real-time Messages (Transcripts)
    const onMessage = (message: any) => {
      // Handle Speech Update (Animation triggers)
      if (message.type === 'speech-update') {
        if (message.status === 'started') setStatus('speaking');
        if (message.status === 'stopped') setStatus('listening');
      }

      // Handle Transcripts
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role, // 'user' or 'assistant'
            text: message.transcript,
          },
        ]);
      }
    };

    // 5. Handle Errors
    const onError = (e: any) => {
      console.error('Vapi Error:', e);
      setStatus('disconnected');
      setIsSessionActive(false);
    };

    // Attach Listeners
    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onError);

    // Cleanup
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