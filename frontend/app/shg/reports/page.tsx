'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { shgApi, type Product, type ShgDashboard } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { PageHeader, Loading, StatusBadge, EmptyState } from '@/components/shg/primitives';
import { FileBarChart, Download, FileText } from 'lucide-react';

type Filter = 'all' | 'APPROVED' | 'REJECTED' | 'PENDING_SHG_VERIFICATION';

function toCsv(rows: Product[]): string {
  const head = ['Listing', 'Crop', 'Quantity', 'Price', 'Farmer', 'Village', 'FPO', 'Status', 'Reason', 'Remark', 'Verified By', 'Verified At', 'Created At'];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((p) => [
    p.name, p.crop, p.quantity, p.expectedPrice ?? p.price, p.farmerName, p.village, p.fpoName,
    p.verificationStatus, p.rejectionReason, p.verificationRemark, p.verifiedByName ?? p.verifiedBy,
    p.verifiedAt, p.createdAt,
  ].map(esc).join(','));
  return [head.join(','), ...lines].join('\n');
}

export default function ReportsPage() {
  const toast = useToast();
  const [dash, setDash] = useState<ShgDashboard | null>(null);
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    (async () => {
      try {
        const [d, pend, appr, rej] = await Promise.all([
          shgApi.dashboard(), shgApi.pendingProducts(), shgApi.approvedProducts(), shgApi.rejectedProducts(),
        ]);
        setDash(d);
        setAll([...appr, ...rej, ...pend].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load report');
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => filter === 'all' ? all : all.filter((p) => p.verificationStatus === filter), [all, filter]);

  const download = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shg-verification-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported as CSV.');
  };

  if (loading) return <Loading label="Building report…" />;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        icon={FileBarChart}
        title="Reports"
        subtitle="A complete record of every verification decision."
        actions={
          <button onClick={download} disabled={rows.length === 0} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      {/* Summary strip */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: 'Total Listings', v: dash?.totalListings ?? 0 },
          { k: 'Approved', v: dash?.totalApproved ?? 0 },
          { k: 'Rejected', v: dash?.totalRejected ?? 0 },
          { k: 'Accuracy', v: `${(dash?.verificationAccuracy ?? 0).toFixed(0)}%` },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.k}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {([['all', 'All'], ['PENDING_SHG_VERIFICATION', 'Pending'], ['APPROVED', 'Approved'], ['REJECTED', 'Rejected']] as [Filter, string][]).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === k ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No records to report" hint="Verification decisions will be listed here." icon={FileText} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Listing</th>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Village</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.crop} · {p.quantity}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.farmerName ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{p.village ?? '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.verificationStatus} /></td>
                    <td className="max-w-[220px] px-4 py-3 text-xs text-slate-500">
                      {p.rejectionReason ? <span className="font-semibold text-rose-600">{p.rejectionReason}</span> : null}
                      {p.verificationRemark ? <span> {p.rejectionReason ? '· ' : ''}{p.verificationRemark}</span> : (!p.rejectionReason ? '—' : null)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(p.verifiedAt ?? p.createdAt ?? '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
