'use client';

import React from 'react';
import { MicOrb } from '@/components/MicOrb';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { NeonButton } from '@/components/NeonButton';
import { XCircle, Loader2 } from 'lucide-react';
import { useVapi } from '@/hooks/useVapi';

export default function AgentPage() {
  const { status, isSessionActive, transcript, toggleCall } = useVapi();

  return (
    <div className="max-w-3xl mx-auto space-y-8 h-[85vh] flex flex-col animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="text-center space-y-2 flex-none">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-agri-400 to-cyan-400">
          Krishi Assistant
        </h1>
        <p className="text-slate-400 text-sm">
          {status === 'disconnected' 
            ? 'Tap the orb to start talking' 
            : 'AI is active and listening...'}
        </p>
      </div>

      {/* Main Interaction Area (The Orb) */}
      <div className="flex-1 flex flex-col justify-center items-center min-h-[300px]">
        <MicOrb status={status} onClick={toggleCall} />
        
        {/* Connection Loader Helper */}
        {status === 'connecting' && (
          <div className="mt-4 flex items-center gap-2 text-agri-400 text-sm animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Establishing secure connection...
          </div>
        )}
      </div>

      {/* Transcript Area */}
      <div className="flex-1 min-h-[250px] max-h-[400px] w-full max-w-2xl mx-auto rounded-xl overflow-hidden relative">
        {/* Top Fade Overlay for smoother scrolling */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#020617] to-transparent z-10 pointer-events-none" />
        
        <TranscriptPanel items={transcript} />
        
        {/* Bottom Fade Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#020617] to-transparent z-10 pointer-events-none" />
      </div>
      {/* Footer Controls */}
      <div className="flex justify-center pt-4 flex-none">
        {isSessionActive && (
          <NeonButton 
            variant="danger" 
            onClick={toggleCall}
            className="w-full md:w-auto shadow-lg shadow-red-500/10"
          >
            <XCircle className="w-4 h-4" />
            End Session
          </NeonButton>
        )}
      </div>
    </div>
  );
}