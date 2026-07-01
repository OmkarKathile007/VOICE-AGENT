'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { shgApi, type FarmerUser } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { PageHeader, Loading, EmptyState } from '@/components/shg/primitives';
import {
  PhoneCall, Phone, Search, Loader2, Signal, MapPin, Building2, User as UserIcon, PhoneOff,
} from 'lucide-react';

/** Normalise a phone string to E.164 for the Vapi outbound call (India default). */
function toE164(raw: string): string | null {
  let d = (raw || '').replace(/[^\d]/g, '');
  if (d.startsWith('0')) d = d.replace(/^0+/, '');
  if (d.length === 10) d = '91' + d;
  if (d.length < 11) return null;
  return '+' + d;
}

async function placeCall(number: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch('/api/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerNumber: number }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, message: res.ok ? (data.message ?? 'Call initiated.') : (data.error ?? 'Failed to initiate call.') };
  } catch {
    return { ok: false, message: 'Network error while initiating the call.' };
  }
}

export default function VoiceOutreachPage() {
  const toast = useToast();
  const [farmers, setFarmers] = useState<FarmerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [callingId, setCallingId] = useState<string | null>(null);

  // Manual dialer
  const [manual, setManual] = useState('+91');
  const [manualBusy, setManualBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try { setFarmers(await shgApi.farmers()); }
      catch (e) { toast.error(e instanceof Error ? e.message : 'Failed to load entries'); }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return farmers.filter((f) => !q || [f.name, f.village, f.fpoName, f.phone].some((v) => v?.toLowerCase().includes(q)));
  }, [farmers, search]);

  const callFarmer = async (f: FarmerUser) => {
    const number = toE164(f.phone ?? '');
    if (!number) { toast.error(`${f.name} has no valid mobile number on record.`); return; }
    setCallingId(f.id);
    const r = await placeCall(number);
    setCallingId(null);
    r.ok ? toast.success(`Calling ${f.name} (${number})… the AI agent will reach them shortly.`) : toast.error(r.message);
  };

  const callManual = async () => {
    const number = toE164(manual);
    if (!number) { toast.error('Enter a valid 10-digit mobile number.'); return; }
    setManualBusy(true);
    const r = await placeCall(number);
    setManualBusy(false);
    r.ok ? toast.success(`Calling ${number}… the AI agent will reach them shortly.`) : toast.error(r.message);
  };

  if (loading) return <Loading label="Loading entries…" />;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        icon={PhoneCall}
        title="Voice Outreach"
        subtitle="Place an AI agent call to a registered FPO / farmer so they can list produce by voice."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Manual dialer */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <PhoneCall className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-base font-extrabold text-white">Quick Dial</h2>
              <p className="mt-1 text-xs text-emerald-50/80">Call any number directly</p>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <input
                  type="tel"
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-mono tracking-wider text-slate-800 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <button
                onClick={callManual}
                disabled={manualBusy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
              >
                {manualBusy ? <><Loader2 className="h-5 w-5 animate-spin" /> Dialing…</> : <><Signal className="h-5 w-5" /> Initiate AI Agent Call</>}
              </button>
              <p className="text-center text-xs text-slate-400">The farmer receives a call and lists produce by talking to the AI agent.</p>
            </div>
          </div>
        </div>

        {/* Registered entries */}
        <div className="lg:col-span-2">
          <div className="mb-4 relative sm:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, village, number…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState title={search ? `No entries match “${search}”` : 'No registered FPOs / farmers yet'} hint="Entries appear here as FPOs register with a mobile number." icon={UserIcon} />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <ul className="divide-y divide-slate-100">
                {filtered.map((f) => {
                  const hasPhone = !!toE164(f.phone ?? '');
                  const busy = callingId === f.id;
                  return (
                    <li key={f.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {f.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{f.name} <span className="ml-1 text-[11px] font-semibold text-slate-400">{f.role}</span></p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                          {f.village && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {f.village}</span>}
                          {f.fpoName && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {f.fpoName}</span>}
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-3 w-3" /> {f.phone || 'No number'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => callFarmer(f)}
                        disabled={!hasPhone || busy}
                        title={hasPhone ? 'Initiate AI agent call' : 'No mobile number on record'}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                          hasPhone ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'cursor-not-allowed bg-slate-100 text-slate-400'
                        }`}
                      >
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasPhone ? <PhoneCall className="h-3.5 w-3.5" /> : <PhoneOff className="h-3.5 w-3.5" />}
                        {busy ? 'Calling…' : 'Call'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
