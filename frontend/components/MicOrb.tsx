


'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Mic, Activity, Loader2 } from 'lucide-react';

// main agent mic orb component with canvas wave animation and status badge

type AgentStatus = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

interface MicOrbProps {
  status: AgentStatus;
  onClick: () => void;
}

export const MicOrb = ({ status, onClick }: MicOrbProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const isActive = status !== 'disconnected' && status !== 'connecting';

  // ── Canvas wave renderer ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 260;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const getWaveConfig = () => {
      switch (status) {
        case 'listening':
          return { waves: 4, amp: 22, speed: 0.04, color1: '#10b981', color2: '#34d399', rings: 3 };
        case 'speaking':
          return { waves: 6, amp: 32, speed: 0.07, color1: '#06b6d4', color2: '#67e8f9', rings: 5 };
        case 'thinking':
          return { waves: 3, amp: 14, speed: 0.02, color1: '#a855f7', color2: '#d8b4fe', rings: 3 };
        case 'connecting':
          return { waves: 2, amp: 8, speed: 0.06, color1: '#eab308', color2: '#fde047', rings: 2 };
        default:
          return { waves: 2, amp: 5, speed: 0.01, color1: '#334155', color2: '#475569', rings: 2 };
      }
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const cfg = getWaveConfig();

      // ── Outer pulsing rings ──
      for (let r = 0; r < cfg.rings; r++) {
        const phase = (t * cfg.speed * 60 + r * (1 / cfg.rings)) % 1;
        const radius = 80 + phase * 70;
        const alpha = (1 - phase) * (status === 'disconnected' ? 0.08 : 0.22);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = cfg.color1 + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Waving blob border ──
      const POINTS = 120;
      const BASE_R = 72;

      for (let layer = 0; layer < 2; layer++) {
        ctx.beginPath();
        for (let i = 0; i <= POINTS; i++) {
          const angle = (i / POINTS) * Math.PI * 2;
          let r = BASE_R;
          for (let w = 1; w <= cfg.waves; w++) {
            const waveOffset = layer * Math.PI * 0.4;
            r += (cfg.amp / w) *
              Math.sin(w * angle + t * cfg.speed * 60 * (w % 2 === 0 ? 1 : -1) * 0.8 + waveOffset);
          }
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Gradient fill for the blob
        const grad = ctx.createRadialGradient(cx, cy - 10, 10, cx, cy, BASE_R + cfg.amp);
        if (layer === 0) {
          grad.addColorStop(0, cfg.color2 + '33');
          grad.addColorStop(0.6, cfg.color1 + '22');
          grad.addColorStop(1, cfg.color1 + '08');
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          grad.addColorStop(0, cfg.color2 + '88');
          grad.addColorStop(1, cfg.color1 + '44');
          ctx.strokeStyle = grad;
          ctx.lineWidth = layer === 0 ? 2 : 1.5;
          ctx.stroke();
        }
      }

      // ── Inner glow core ──
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, BASE_R - 10);
      coreGrad.addColorStop(0, cfg.color2 + '44');
      coreGrad.addColorStop(0.5, cfg.color1 + '22');
      coreGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, BASE_R - 10, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();
    };

    const loop = (ts: number) => {
      if (!timeRef.current) timeRef.current = ts;
      drawFrame((ts - timeRef.current) / 1000);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      timeRef.current = 0;
    };
  }, [status]);

  // ── Status config ─────────────────────────────────────────────────────
  const statusConfig = {
    disconnected: {
      label: 'TAP TO SPEAK',
      labelColor: 'text-slate-400',
      badgeBg: 'bg-slate-800/60 border-slate-700/50',
      dotColor: 'bg-slate-500',
    },
    connecting: {
      label: 'CONNECTING',
      labelColor: 'text-yellow-400',
      badgeBg: 'bg-yellow-950/40 border-yellow-700/40',
      dotColor: 'bg-yellow-400 animate-ping',
    },
    listening: {
      label: 'LISTENING',
      labelColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/40 border-emerald-700/40',
      dotColor: 'bg-emerald-400 animate-ping',
    },
    thinking: {
      label: 'THINKING',
      labelColor: 'text-purple-400',
      badgeBg: 'bg-purple-950/40 border-purple-700/40',
      dotColor: 'bg-purple-400 animate-ping',
    },
    speaking: {
      label: 'SPEAKING',
      labelColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/40 border-cyan-700/40',
      dotColor: 'bg-cyan-400 animate-ping',
    },
  };

  const cfg = statusConfig[status];

  return (
    <div className="relative flex flex-col items-center justify-center gap-5 select-none">
      {/* Canvas wave layer + clickable orb */}
      <div className="relative w-[200px] h-[200px] flex items-center justify-center">

        {/* Wave canvas — sits behind the button */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: 'scale(1.05)' }}
        />

        {/* Mic button core */}
        <button
          onClick={onClick}
          aria-label={`Voice agent: ${status}`}
          className={cn(
            'relative z-10 w-[108px] h-[108px] rounded-full flex items-center justify-center',
            'transition-all duration-500 ease-out',
            'border border-white/10',
            'hover:scale-105 active:scale-95',
            // Core background by status
            status === 'disconnected' && 'bg-slate-800 shadow-[0_0_0px_transparent]',
            status === 'connecting' && 'bg-yellow-900/60 shadow-[0_0_24px_rgba(234,179,8,0.5)]',
            status === 'listening' && 'bg-emerald-900/60 shadow-[0_0_32px_rgba(16,185,129,0.6)]',
            status === 'thinking' && 'bg-purple-900/60 shadow-[0_0_28px_rgba(168,85,247,0.6)]',
            status === 'speaking' && 'bg-cyan-900/60 shadow-[0_0_40px_rgba(6,182,212,0.8)]',
          )}
        >
          {/* Icon */}
          {status === 'connecting' ? (
            <Loader2 className="w-10 h-10 text-yellow-300 animate-spin" />
          ) : status === 'speaking' ? (
            <Activity className="w-10 h-10 text-cyan-200 animate-pulse" />
          ) : (
            <Mic className={cn(
              'w-10 h-10 transition-colors duration-300',
              status === 'disconnected' ? 'text-slate-400' :
              status === 'listening' ? 'text-emerald-200' :
              'text-purple-200'
            )} />
          )}

          {/* Inner shimmer ring */}
          <span className={cn(
            'absolute inset-0 rounded-full border opacity-0 transition-opacity duration-500',
            isActive && 'opacity-100',
            status === 'listening' && 'border-emerald-400/30',
            status === 'speaking' && 'border-cyan-400/30',
            status === 'thinking' && 'border-purple-400/30',
            status === 'connecting' && 'border-yellow-400/30',
          )} />
        </button>
      </div>

      {/* Status badge */}
      <div className={cn(
        'flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md',
        'font-mono text-xs tracking-[0.18em] uppercase transition-all duration-300',
        cfg.badgeBg, cfg.labelColor
      )}>
        <span className={cn('w-1.5 h-1.5 rounded-full inline-block', cfg.dotColor)} />
        {cfg.label}
      </div>

      {/* Soundwave bars — shown only when speaking */}
      {status === 'speaking' && (
        <div className="flex items-end justify-center gap-[3px] h-8 mt-[-8px]">
          {[...Array(9)].map((_, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-cyan-400/70 animate-bounce"
              style={{
                height: `${Math.random() * 20 + 8}px`,
                animationDuration: `${0.4 + Math.random() * 0.5}s`,
                animationDelay: `${i * 0.06}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};