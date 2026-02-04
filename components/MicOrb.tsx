import React from 'react';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Activity } from 'lucide-react';

type AgentStatus = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

interface MicOrbProps {
  status: AgentStatus;
  onClick: () => void;
}

export const MicOrb = ({ status, onClick }: MicOrbProps) => {
  const isActive = status !== 'disconnected' && status !== 'connecting';
  
  // Dynamic styles based on status
  const getOrbStyles = () => {
    switch (status) {
      case 'listening':
        return "bg-agri-500 shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-pulse";
      case 'thinking':
        return "bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse-slow";
      case 'speaking':
        return "bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.8)] animate-glow";
      case 'connecting':
        return "bg-yellow-500 animate-spin";
      default: // disconnected
        return "bg-slate-700 hover:bg-slate-600 shadow-none";
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 py-10">
      {/* The Glowing Orb */}
      <button
        onClick={onClick}
        className={cn(
          "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out z-10 border-4 border-white/5",
          getOrbStyles()
        )}
      >
        {status === 'disconnected' ? (
          <Mic className="w-12 h-12 text-slate-300" />
        ) : status === 'speaking' ? (
          <Activity className="w-12 h-12 text-white animate-bounce" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}
      </button>

      {/* Status Text Badge */}
      <div className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium tracking-wider border backdrop-blur-md transition-colors",
        status === 'disconnected' ? "bg-slate-800/50 border-white/10 text-slate-400" :
        status === 'listening' ? "bg-agri-500/10 border-agri-500/30 text-agri-400" :
        status === 'speaking' ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" :
        "bg-purple-500/10 border-purple-500/30 text-purple-400"
      )}>
        {status === 'disconnected' ? 'Tap to Speak' : status.toUpperCase()}
      </div>
    </div>
  );
};