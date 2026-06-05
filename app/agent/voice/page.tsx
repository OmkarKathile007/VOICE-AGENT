

'use client';

import React, { useEffect, useRef } from 'react';
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { NeonButton } from '@/components/NeonButton';
import { XCircle, Loader2, Cpu, Zap, Mic } from 'lucide-react';
import { useVapi } from '@/hooks/useVapi';
import { useRouter } from 'next/navigation';

// Map Vapi status → hue shift for the orb (degrees)
const STATUS_HUE: Record<string, number> = {
  disconnected: 0,    // purple (default)
  connecting:   55,   // yellow
  listening:    140,  // green
  thinking:     270,  // violet
  speaking:     185,  // cyan
};

// ── Floating particle canvas ────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }[] = [];

    const COLORS = ['#06b6d4', '#10b981', '#6366f1', '#a855f7', '#0891b2'];

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    let raf: number;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── Trigger phrase detection ────────────────────────────────────────────
const TRIGGER_PHRASES = [
  'switch to ai voice agent',
  'switch to voice agent',
  'go to voice agent',
  'open voice agent',
  'launch voice agent',
];

function containsTrigger(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return TRIGGER_PHRASES.some((phrase) => normalized.includes(phrase));
}

// ── Main page ───────────────────────────────────────────────────────────
export default function AgentPage() {
  const { status, isSessionActive, transcript, toggleCall } = useVapi();
  const router = useRouter();
  const redirectedRef = useRef(false);

  // Watch transcript for trigger phrase
  useEffect(() => {
    if (redirectedRef.current || transcript.length === 0) return;

    const latest = transcript[transcript.length - 1];
    // Only act on assistant/system messages
    if (latest?.role === 'assistant' && containsTrigger(latest.text ?? '')) {
      redirectedRef.current = true;
      // Flag for /admin page to auto-start mic
      sessionStorage.setItem('autoStartMic', 'true');
      router.push('/admin');
    }
  }, [transcript, router]);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[85vh] flex flex-col rounded-[2.5rem] bg-[#020810] border border-cyan-900/30 shadow-[0_0_100px_-20px_rgba(8,145,178,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-700">

      {/* ── Ambient background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticleCanvas />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b212_1px,transparent_1px),linear-gradient(to_bottom,#0891b212_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]" />
        <div className="absolute top-[-15%] left-[-5%] w-[420px] h-[420px] bg-cyan-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-10%] right-[-8%] w-[380px] h-[380px] bg-indigo-600/12 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-10">

        {/* HUD Header */}
        <div className="flex-none text-center space-y-3 pb-6 border-b border-cyan-900/25">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-300 uppercase">
              System Online
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #67e8f9 0%, #38bdf8 30%, #818cf8 60%, #34d399 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 5s ease infinite',
              filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.35))',
            }}>
            Krishi
          </h1>

          <div className="flex items-center justify-center gap-2 h-6">
            {status === 'disconnected' ? (
              <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.25em]">
                Awaiting Voice Input
              </p>
            ) : (
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]"
                style={{ color: status === 'listening' ? '#34d399' : status === 'speaking' ? '#06b6d4' : '#a855f7' }}>
                <Zap className="w-3.5 h-3.5 animate-pulse" />
                {status === 'listening' ? 'Voice Input Active' :
                 status === 'speaking' ? 'Generating Response' :
                 status === 'thinking' ? 'Processing...' : 'Connecting...'}
              </div>
            )}
          </div>
        </div>

        {/* Orb area */}
        <div className="flex-1 flex flex-col justify-center items-center min-h-[250px] relative">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[60px] transition-all duration-1000"
            style={{
              background: status === 'listening' ? 'rgba(16,185,129,0.12)' :
                          status === 'speaking'  ? 'rgba(6,182,212,0.15)' :
                          status === 'thinking'  ? 'rgba(168,85,247,0.12)' :
                          'rgba(6,182,212,0.05)',
            }}
          />

          <button
            onClick={toggleCall}
            aria-label={`Voice agent: ${status}`}
            className="relative z-10 w-56 h-56 rounded-full hover:scale-[1.03] active:scale-95 transition-transform duration-300 focus:outline-none"
            style={{ filter: status !== 'disconnected' ? 'drop-shadow(0 0 32px rgba(99,102,241,0.45))' : 'none' }}
          >
            <VoicePoweredOrb
              hue={STATUS_HUE[status] ?? 0}
              enableVoiceControl={status === 'listening'}
              className="rounded-full overflow-hidden"
            />

            {/* Mic icon overlay — centered inside the orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {status === 'connecting' ? (
                <Loader2 className="w-10 h-10 text-white/80 animate-spin drop-shadow-lg" />
              ) : status === 'speaking' ? (
                <Zap className="w-10 h-10 text-white/90 animate-pulse drop-shadow-lg" />
              ) : (
                <Mic className="w-10 h-10 text-white/90 drop-shadow-lg" />
              )}
            </div>
          </button>

          {status === 'connecting' && (
            <div className="absolute bottom-4 flex items-center gap-3 px-4 py-2 rounded-xl bg-yellow-950/40 border border-yellow-800/40 backdrop-blur-md text-yellow-300 text-xs font-mono tracking-wider animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Establishing secure handshake...
            </div>
          )}
        </div>

        {/* Transcript panel */}
        <div className="flex-none h-[30vh] md:h-[250px] w-full max-w-3xl mx-auto relative group">
          {['tl','tr','bl','br'].map(pos => (
            <div key={pos} className={`absolute z-20 w-5 h-5 ${
              pos === 'tl' ? 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg' :
              pos === 'tr' ? 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg' :
              pos === 'bl' ? 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg' :
                             'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
            } border-cyan-500/40`} />
          ))}

          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-slate-900/80 border border-cyan-900/40 text-[9px] font-mono text-cyan-600 tracking-[0.3em] uppercase">
            Transcript
          </div>

          <div className="w-full h-full rounded-xl bg-slate-950/50 backdrop-blur-xl border border-white/[0.04] shadow-[inset_0_0_40px_rgba(8,145,178,0.04)] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-14 bg-gradient-to-b from-slate-950/90 to-transparent z-10 pointer-events-none" />
            <div className="h-full w-full p-5 pt-8 overflow-y-auto custom-scrollbar">
              <TranscriptPanel items={transcript} />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-slate-950/90 to-transparent z-10 pointer-events-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-6 flex-none min-h-[80px]">
          {isSessionActive ? (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <NeonButton
                variant="danger"
                onClick={toggleCall}
                className="group relative overflow-hidden w-full md:w-auto px-10 py-3 rounded-full bg-red-950/50 border border-red-500/40 hover:bg-red-900/50 hover:border-red-400 transition-all shadow-[0_0_24px_rgba(239,68,68,0.2)] hover:shadow-[0_0_36px_rgba(239,68,68,0.45)]"
              >
                <div className="flex items-center gap-2 text-red-400 font-mono tracking-widest text-xs uppercase group-hover:text-red-300">
                  <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Terminate Session
                </div>
              </NeonButton>
            </div>
          ) : (
            <div className="h-[46px]" />
          )}
        </div>
      </div>

      {/* Global styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6,182,212,0.25);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6,182,212,0.45);
        }
      `}} />
    </div>
  );
}
