'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { shgApi, type Shg, type ShgDashboard } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageHeader, Loading, StatCard } from '@/components/shg/primitives';
import {
  UserCircle, MapPin, Phone, Mail, Building2, User as UserIcon,
  Users, PackageCheck, Target, LogOut, ShieldCheck,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [shg, setShg] = useState<Shg | null>(null);
  const [dash, setDash] = useState<ShgDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, d] = await Promise.all([shgApi.profile(), shgApi.dashboard()]);
        setShg(s);
        setDash(d);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load profile');
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading label="Loading profile…" />;

  const rows = [
    { icon: UserIcon, label: 'Contact Person', value: shg?.contactPerson ?? user?.name },
    { icon: Mail, label: 'Email', value: shg?.email ?? user?.email },
    { icon: Phone, label: 'Phone', value: shg?.phone },
    { icon: MapPin, label: 'Location', value: [shg?.village, shg?.taluka, shg?.district].filter(Boolean).join(', ') || '—' },
    { icon: Building2, label: 'Mapped FPOs', value: shg?.mappedFPOIds?.length ? `${shg.mappedFPOIds.length} FPO(s)` : '—' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader icon={UserCircle} title="SHG Profile" subtitle="Your Self-Help Group details and verification footprint." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-8 text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-extrabold text-white backdrop-blur-sm">
                {(shg?.name ?? 'S').charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-extrabold text-white">{shg?.name ?? user?.name}</h2>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-50">
                <ShieldCheck className="h-3.5 w-3.5" /> Verification Authority
              </span>
            </div>
            <div className="divide-y divide-slate-100 px-6 py-2">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center gap-3 py-3">
                  <r.icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{r.label}</p>
                    <p className="truncate text-sm font-semibold text-slate-700">{r.value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 p-4">
              <button
                onClick={() => { logout(); router.push('/login'); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Footprint */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Total Farmers" value={dash?.totalFarmers ?? 0} icon={Users} accent="sky" />
            <StatCard label="Listings Verified" value={(dash?.totalApproved ?? 0) + (dash?.totalRejected ?? 0)} icon={PackageCheck} accent="emerald" />
            <StatCard label="Approved" value={dash?.totalApproved ?? 0} icon={PackageCheck} accent="emerald" />
            <StatCard label="Verification Accuracy" value={`${(dash?.verificationAccuracy ?? 0).toFixed(0)}%`} icon={Target} accent="violet" />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-sm font-extrabold text-slate-800">About this role</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              As a Self-Help Group, you act as the local verification authority for farmer produce. You review
              AI-extracted listing details, verify quality and certification information, and approve or reject
              each listing. Approved produce is published to the marketplace; rejected produce is returned to the
              farmer with your remarks. You can only access farmers and listings mapped to your SHG.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
