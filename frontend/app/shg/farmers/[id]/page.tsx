'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { shgApi, type FarmerDetail, type Product } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { Loading, StatCard, StatusBadge, QualityMeter, CropImage } from '@/components/shg/primitives';
import {
  ArrowLeft, User, MapPin, Building2, Phone, Mail, Sprout, Landmark,
  Package, PackageCheck, PackageX, Clock,
} from 'lucide-react';

function ListingRow({ p }: { p: Product }) {
  return (
    <Link href={`/shg/verify/${p.id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50">
      <CropImage src={p.imageUrl} alt={p.name} className="h-11 w-11 shrink-0 rounded-lg border border-slate-100" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">{p.name}</p>
        <p className="flex items-center gap-1 text-xs text-slate-400"><Sprout className="h-3 w-3" /> {p.crop} · {p.quantity}</p>
      </div>
      <QualityMeter score={p.qualityScore} className="hidden sm:flex" />
      <StatusBadge status={p.verificationStatus} />
    </Link>
  );
}

function Section({ title, icon: Icon, items, empty }: { title: string; icon: typeof Package; items: Product[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
        <Icon className="h-4 w-4 text-slate-400" /> {title} <span className="text-slate-300">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">{empty}</p>
      ) : (
        <div className="space-y-2.5">{items.map((p) => <ListingRow key={p.id} p={p} />)}</div>
      )}
    </div>
  );
}

export default function FarmerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [data, setData] = useState<FarmerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setData(await shgApi.farmer(id)); }
      catch (e) { toast.error(e instanceof Error ? e.message : 'Failed to load farmer'); }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loading label="Loading farmer…" />;
  if (!data) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-semibold text-slate-500">Farmer not found or not mapped to your SHG.</p>
        <Link href="/shg/farmers" className="mt-3 inline-block text-sm font-bold text-emerald-600">← Back to farmers</Link>
      </div>
    );
  }

  const f = data.farmer;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Farmer Profile</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-extrabold text-emerald-700">
              {f.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">{f.name}</h2>
            <p className="text-sm text-slate-400">{f.role}</p>
            <div className="mt-5 space-y-1 text-left">
              {[
                { icon: Mail, v: f.email },
                { icon: Phone, v: f.phone },
                { icon: MapPin, v: [f.village, f.taluka, f.district].filter(Boolean).join(', ') },
                { icon: Building2, v: f.fpoName },
                { icon: Landmark, v: f.landDetails },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-2.5 border-t border-slate-100 py-2.5 first:border-0">
                  <r.icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{r.v || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total" value={data.totalListings} icon={Package} accent="slate" />
            <StatCard label="Approved" value={data.approvedListings.length} icon={PackageCheck} accent="emerald" />
            <StatCard label="Rejected" value={data.rejectedListings.length} icon={PackageX} accent="rose" />
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-6 lg:col-span-2">
          <Section title="Current Listings" icon={Clock} items={data.currentListings} empty="No listings awaiting verification." />
          <Section title="Approval History" icon={PackageCheck} items={data.approvedListings} empty="No approved listings yet." />
          <Section title="Rejected Listings" icon={PackageX} items={data.rejectedListings} empty="No rejected listings." />
        </div>
      </div>
    </div>
  );
}
