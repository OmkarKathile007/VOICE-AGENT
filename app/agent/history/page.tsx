'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Calendar, Clock, FileText, CheckCircle2, Activity, Terminal, Trash2, RefreshCw } from 'lucide-react';
import { sessionsApi, VoiceSession } from '@/lib/api';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionsApi.getMySessions();
      setSessions(data);
    } catch {
      setError('Failed to load session history. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await sessionsApi.deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">

      {/* Header */}
      <div className="relative border-b border-cyan-900/40 pb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/50 border border-cyan-500/30 shadow-[0_0_15px_rgba(8,145,178,0.2)]">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                System Logs
              </h1>
              <div className="flex items-center gap-2 text-cyan-500/80 font-mono text-sm uppercase tracking-widest mt-1">
                <Terminal className="w-4 h-4" />
                Session History Archive
              </div>
            </div>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 text-sm font-medium hover:bg-cyan-900/40 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <p className="text-cyan-500/60 font-mono text-xs mt-1">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} archived
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
          <p className="text-cyan-400/60 font-mono text-sm">Loading session archive...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-5 rounded-2xl bg-red-950/30 border border-red-800/40 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-2xl border border-cyan-900/30 bg-cyan-950/10">
          <Terminal className="w-10 h-10 text-cyan-800" />
          <p className="text-cyan-600 font-mono text-sm">No sessions logged yet.</p>
          <p className="text-cyan-700/60 font-mono text-xs">Use the Voice Agent to start logging sessions.</p>
        </div>
      )}

      {/* Timeline */}
      {!loading && !error && sessions.length > 0 && (
        <div className="relative pl-4 md:pl-10 space-y-8">
          <div className="absolute top-8 left-[23px] md:left-[47px] bottom-10 w-0.5 bg-linear-to-b from-cyan-400/60 via-blue-900/40 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.6)]" />

          {sessions.map((session) => (
            <div key={session.id} className="relative group">
              {/* Node */}
              <div className="absolute -left-[18px] md:-left-3 top-6 w-5 h-5 rounded-full bg-[#030712] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.6)] group-hover:scale-125 group-hover:border-white transition-all duration-300 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 group-hover:bg-white animate-pulse" />
              </div>

              <div className="ml-6 md:ml-10 relative rounded-2xl bg-linear-to-br from-cyan-900/30 via-slate-900/20 to-blue-900/20 p-px transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(8,145,178,0.3)] hover:from-cyan-500/50">
                <GlassCard className="relative h-full w-full bg-[#030712]/80 backdrop-blur-xl border-none rounded-2xl overflow-hidden p-6 md:p-8">
                  {/* Delete button */}
                  {session.id && (
                    <button onClick={() => handleDelete(session.id!)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-900/40 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="flex flex-col md:flex-row gap-8 justify-between items-start relative z-10">
                    {/* Meta */}
                    <div className="min-w-[180px] flex flex-row md:flex-col gap-4 md:gap-3 py-2 px-4 md:px-0 md:py-0 bg-cyan-950/20 md:bg-transparent rounded-lg border border-cyan-900/30 md:border-none w-full md:w-auto">
                      <div className="flex items-center gap-3 text-cyan-300 font-mono text-sm tracking-wide">
                        <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        {formatDate(session.createdAt)}
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 font-mono text-sm tracking-wide">
                        <div className="p-1.5 rounded-md bg-slate-800/50 text-slate-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        {session.duration || '—'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h4 className="flex items-center gap-2 text-white/90 font-semibold mb-2 text-lg">
                          <FileText className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                          Query Summary
                        </h4>
                        <p className="text-slate-300 text-base leading-relaxed pl-7">{session.summary}</p>
                      </div>

                      {session.actions && session.actions.length > 0 && (
                        <div className="pl-7">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-t-lg bg-cyan-950/40 border-t border-l border-r border-cyan-900/50">
                            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">Executed Directives</span>
                          </div>
                          <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-b-lg rounded-tr-lg p-4 shadow-[inset_0_0_20px_rgba(8,145,178,0.05)]">
                            <ul className="space-y-3">
                              {session.actions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-cyan-100/80 group/item">
                                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)] group-hover/item:text-cyan-300 transition-colors" />
                                  <span className="group-hover/item:text-white transition-colors">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
