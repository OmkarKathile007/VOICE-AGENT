'use client';

import React from 'react';

/* ─── Grouped vertical bars: verification trend over time ───────────────────── */
export function TrendBars({ data }: {
  data: { date: string; approved: number; rejected: number; pending: number }[];
}) {
  const max = Math.max(1, ...data.flatMap((d) => [d.approved, d.rejected, d.pending]));
  const day = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { weekday: 'short' });

  return (
    <div>
      <div className="flex h-44 items-end justify-between gap-2">
        {data.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-36 w-full items-end justify-center gap-[3px]">
              {[
                { v: d.approved, c: 'bg-emerald-500' },
                { v: d.rejected, c: 'bg-rose-500' },
                { v: d.pending, c: 'bg-amber-400' },
              ].map((b, i) => (
                <div
                  key={i}
                  className={`w-2.5 rounded-t-sm ${b.c} transition-all`}
                  style={{ height: `${(b.v / max) * 100}%`, minHeight: b.v > 0 ? 4 : 0 }}
                  title={`${b.v}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{day(d.date)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        {[['Approved', 'bg-emerald-500'], ['Rejected', 'bg-rose-500'], ['New', 'bg-amber-400']].map(([l, c]) => (
          <span key={l} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <span className={`h-2.5 w-2.5 rounded-sm ${c}`} /> {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut: status breakdown ───────────────────────────────────────────────── */
export function Donut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 54, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#f1f5f9" strokeWidth="16" />
          {total > 0 && segments.map((s, i) => {
            const len = (s.value / total) * C;
            const el = (
              <circle
                key={i}
                cx="70" cy="70" r={R} fill="none"
                stroke={s.color} strokeWidth="16"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-900">{total}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} />
            <span className="font-semibold text-slate-600">{s.label}</span>
            <span className="ml-auto font-extrabold tabular-nums text-slate-900">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Horizontal ranked bars ────────────────────────────────────────────────── */
export function RankedBars({ items, color = '#10b981', emptyLabel = 'No data yet' }: {
  items: { label: string; count: number }[];
  color?: string;
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (items.length === 0) return <p className="py-6 text-center text-sm text-slate-400">{emptyLabel}</p>;
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate font-semibold text-slate-600">{i.label}</span>
            <span className="font-extrabold tabular-nums text-slate-800">{i.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full transition-all" style={{ width: `${(i.count / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
