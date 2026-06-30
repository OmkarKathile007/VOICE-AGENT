'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { VerificationStatus } from '@/lib/api';
import { Loader2, Inbox, type LucideIcon } from 'lucide-react';

/* ─── Status badge ──────────────────────────────────────────────────────────── */
export function StatusBadge({ status, className }: { status?: VerificationStatus | string; className?: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    PENDING_SHG_VERIFICATION: { label: 'Pending', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    APPROVED: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    REJECTED: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  };
  const s = map[status ?? ''] ?? { label: status ?? '—', cls: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', s.cls, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}

/* ─── Dashboard stat card ───────────────────────────────────────────────────── */
export function StatCard({
  label, value, icon: Icon, accent = 'emerald', sub, loading,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  accent?: 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'slate';
  sub?: string;
  loading?: boolean;
}) {
  const accents: Record<string, string> = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
    sky: 'text-sky-600 bg-sky-50 border-sky-100',
    violet: 'text-violet-600 bg-violet-50 border-violet-100',
    slate: 'text-slate-600 bg-slate-100 border-slate-200',
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          {loading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-slate-100" />
          ) : (
            <p className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">{value}</p>
          )}
          {sub && <p className="mt-1 text-xs font-medium text-slate-400">{sub}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ─── Section header ────────────────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, icon: Icon, actions }: {
  title: string; subtitle?: string; icon?: LucideIcon; actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ─── Quality score meter ───────────────────────────────────────────────────── */
export function QualityMeter({ score, className }: { score?: number; className?: string }) {
  if (score == null) return <span className="text-xs text-slate-400">No scan</span>;
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  const text = pct >= 80 ? 'text-emerald-700' : pct >= 60 ? 'text-amber-700' : 'text-rose-700';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-xs font-bold tabular-nums', text)}>{Math.round(pct)}</span>
    </div>
  );
}

/* ─── Loading / empty states ────────────────────────────────────────────────── */
export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}

export function EmptyState({ title, hint, icon: Icon = Inbox }: { title: string; hint?: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-300">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-slate-700">{title}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-slate-400">{hint}</p>}
    </div>
  );
}

/* ─── Crop image with graceful fallback ─────────────────────────────────────── */
export function CropImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = React.useState(false);
  const has = src && src.trim().length > 0 && !failed;
  if (!has) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-emerald-50 to-lime-50 text-emerald-300', className)}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={cn('object-cover', className)} onError={() => setFailed(true)} />;
}
