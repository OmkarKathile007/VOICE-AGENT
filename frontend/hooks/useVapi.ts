'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { api } from '@/lib/api';

const getVapiInstance = () => {
  if (typeof window !== 'undefined') {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.warn('Vapi Warning: NEXT_PUBLIC_VAPI_PUBLIC_KEY is missing!');
    }
    return publicKey ? new Vapi(publicKey) : null;
  }
  return null;
};

const normalizeTranscriptText = (text: string) =>
  text.trim().replace(/\s+/g, ' ');

export function useVapi() {
  const [status, setStatus] = useState<
    'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking'
  >('disconnected');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [transcript, setTranscript] = useState<{ role: string; text: string }[]>([]);

  const vapiRef = useRef<any>(null);
  // Track processed tool-call IDs to avoid duplicate saves
  const processedCallIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = getVapiInstance();
    }

    const vapi = vapiRef.current;
    if (!vapi) return;

    const onCallStart = () => {
      setStatus('listening');
      setIsSessionActive(true);
      setTranscript([]);
      processedCallIds.current.clear();
    };

    const onCallEnd = () => {
      setStatus('disconnected');
      setIsSessionActive(false);
      setTranscript([]);
    };

    const onSpeechStart = () => setStatus('speaking');
    const onSpeechEnd = () => setStatus('listening');

    const onMessage = async (message: any) => {
      // ── Transcript ──────────────────────────────────────────────────────
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const text = normalizeTranscriptText(message.transcript ?? '');
        if (!text) return;

        setTranscript(prev => {
          const role = message.role ?? 'user';
          const isDuplicate = prev
            .slice(-3)
            .some(item => item.role === role && normalizeTranscriptText(item.text) === text);
          if (isDuplicate) return prev;
          return [...prev, { role, text }];
        });
      }

      // ── Tool calls — this is what saves listings to MongoDB ─────────────
      if (message.type === 'tool-calls') {
        console.log('🛠️ Tool call received:', message);

        for (const toolCall of message.toolCallList ?? []) {
          if (processedCallIds.current.has(toolCall.id)) {
            console.log('⚠️ Skipping duplicate tool call:', toolCall.id);
            continue;
          }

          if (toolCall.function?.name === 'createListing') {
            processedCallIds.current.add(toolCall.id);

            let args = toolCall.function.arguments;
            if (typeof args === 'string') args = JSON.parse(args);

            const { crop, quantity, price, location } = args;

            setTranscript(prev => [
              ...prev,
              { role: 'assistant', text: `Saving listing for ${crop}…` },
            ]);

            try {
              const result = await api.createListing({
                crop,
                quantity: String(quantity),
                price: String(price),
                location,
                source: 'voice',
              });

              console.log('✅ Listing saved:', result);

              // Send the result back to Vapi so the assistant can confirm to the user
              vapi.send({
                type: 'tool-output',
                toolCallList: [
                  {
                    id: toolCall.id,
                    result: result
                      ? `Listing for ${crop} saved successfully.`
                      : 'Failed to save listing. Please try again.',
                  },
                ],
              } as any);
            } catch (err) {
              console.error('❌ Failed to save listing:', err);
              vapi.send({
                type: 'tool-output',
                toolCallList: [{ id: toolCall.id, result: 'Error saving listing.' }],
              } as any);
            }
          }
        }
      }
    };

    const onError = (e: any) => {
      console.error(
        '🔥 Vapi Error:',
        JSON.stringify(e, null, 2) === '{}'
          ? 'Auth/network failure (check keys and mic permission)'
          : e,
      );
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

  const toggleCall = useCallback(async () => {
    const vapi = vapiRef.current;

    if (!vapi) {
      alert('System Error: Vapi Public Key is missing in your .env file.');
      return;
    }

    if (isSessionActive) {
      vapi.stop();
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      alert('System Error: Assistant ID is missing in your .env file.');
      return;
    }

    try {
      setStatus('connecting');
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log(`Starting Vapi session: ${assistantId}`);
      await vapi.start(assistantId);
    } catch (err) {
      console.error('Failed to start Vapi:', err);
      setStatus('disconnected');
      setIsSessionActive(false);
    }
  }, [isSessionActive]);

  return { status, isSessionActive, transcript, toggleCall };
}
