'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { shgApi, type ShgDashboard, type Product } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { StatCard, PageHeader, Loading, StatusBadge, QualityMeter, CropImage } from '@/components/shg/primitives';
import {
  Clock, PackageCheck, PackageX, Users, Building2, Target,
  LayoutDashboard, ArrowRight, Sprout, MapPin, ChevronRight,
} from 'lucide-react';

export default function ShgDashboardPage() {
  const toast = useToast();
  const [data, setData] = useState<ShgDashboard | null>(null);
  const [pending, setPending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [d, p] = await Promise.all([shgApi.dashboard(), shgApi.pendingProducts()]);
        setData(d);
        setPending(p.slice(0, 5));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading label="Loading dashboard…" />;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        icon={LayoutDashboard}
        title={`Welcome, ${data?.shgName ?? 'SHG'}`}
        subtitle="Verify farmer produce before it reaches the marketplace."
        actions={
          <Link href="/shg/pending" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700">
            Review Pending <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Pending Verification" value={data?.pendingVerification ?? 0} icon={Clock} accent="amber" sub="Awaiting your review" />
        <StatCard label="Approved Today" value={data?.approvedToday ?? 0} icon={PackageCheck} accent="emerald" sub={`${data?.totalApproved ?? 0} all-time`} />
        <StatCard label="Rejected Today" value={data?.rejectedToday ?? 0} icon={PackageX} accent="rose" sub={`${data?.totalRejected ?? 0} all-time`} />
        <StatCard label="Total Farmers" value={data?.totalFarmers ?? 0} icon={Users} accent="sky" sub="Mapped to your SHG" />
        <StatCard label="Mapped FPOs" value={data?.mappedFPOs ?? 0} icon={Building2} accent="violet" sub="Producer organizations" />
        <StatCard label="Verification Accuracy" value={`${(data?.verificationAccuracy ?? 0).toFixed(0)}%`} icon={Target} accent="emerald" sub="Approval rate" />
      </div>

      {/* Pending preview */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Clock className="h-4.5 w-4.5 text-amber-500" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Awaiting Verification</h2>
          </div>
          <Link href="/shg/pending" className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <PackageCheck className="h-9 w-9 text-emerald-300" />
            <p className="text-sm font-semibold text-slate-500">All caught up — nothing pending.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.map((p) => (
              <li key={p.id}>
                <Link href={`/shg/verify/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50">
                  <CropImage src={p.imageUrl} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg border border-slate-100" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{p.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Sprout className="h-3 w-3" /> {p.crop}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.village}</span>
                      <span>{p.farmerName}</span>
                    </div>
                  </div>
                  <QualityMeter score={p.qualityScore} className="hidden sm:flex" />
                  <StatusBadge status={p.verificationStatus} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
