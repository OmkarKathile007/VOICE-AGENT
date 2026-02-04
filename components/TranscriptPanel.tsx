'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

export interface TranscriptItem {
  role: 'user' | 'assistant' | 'tool-calls' | 'tool-output';
  text: string;
  isFinal?: boolean; 
}

export const TranscriptPanel = ({ items }: { items: TranscriptItem[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever items change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items]);

  // Filter out tool calls/outputs for cleaner UI, unless you want to debug them
  const visibleItems = items.filter(
    (item) => item.role === 'user' || item.role === 'assistant'
  );

  return (
    <div className="h-full flex flex-col">
      {/* Glass Container for Chat */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-agri-500/30 scrollbar-track-transparent rounded-xl bg-black/20 border border-white/5 backdrop-blur-sm shadow-inner">
        
        {visibleItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
               <Bot className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm tracking-wider font-light">AWAITING AUDIO INPUT...</p>
          </div>
        ) : (
          visibleItems.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-4 animate-in slide-in-from-bottom-2 duration-500",
                item.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar Icon */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                item.role === 'user' 
                  ? "bg-agri-500/20 border-agri-500/50 text-agri-400" 
                  : "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
              )}>
                {item.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "relative max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-md border shadow-lg",
                item.role === 'user' 
                  ? "bg-gradient-to-br from-agri-900/80 to-agri-800/80 border-agri-500/30 text-white rounded-tr-none shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 text-slate-200 rounded-tl-none shadow-[0_0_15px_rgba(6,182,212,0.05)]"
              )}>
                <p className="font-light tracking-wide">
                  {item.text}
                </p>
                {/* Tiny accent line for futuristic feel */}
                <div className={cn(
                    "absolute bottom-0 w-full h-[1px] opacity-30",
                    item.role === 'user' 
                      ? "bg-gradient-to-r from-transparent via-agri-400 to-transparent right-0"
                      : "bg-gradient-to-r from-transparent via-cyan-400 to-transparent left-0"
                )} />
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};