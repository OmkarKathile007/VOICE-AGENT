'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { shgApi, type FarmerUser } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { PageHeader, Loading, EmptyState } from '@/components/shg/primitives';
import { Users, Search, MapPin, Building2, Phone, ChevronRight } from 'lucide-react';

export default function FarmersPage() {
  const toast = useToast();
  const [farmers, setFarmers] = useState<FarmerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try { setFarmers(await shgApi.farmers()); }
      catch (e) { toast.error(e instanceof Error ? e.message : 'Failed to load farmers'); }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return farmers.filter((f) => !q || [f.name, f.village, f.fpoName, f.email].some((v) => v?.toLowerCase().includes(q)));
  }, [farmers, search]);

  if (loading) return <Loading label="Loading farmers…" />;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader icon={Users} title="Farmers" subtitle="Farmers mapped to your SHG through their FPOs." />

      <div className="relative mb-5 sm:max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, village, FPO…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={search ? `No farmers match “${search}”` : 'No farmers mapped yet'} hint="Farmers are linked via their FPO mapping." icon={Users} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <Link
              key={f.id}
              href={`/shg/farmers/${f.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-extrabold text-emerald-700">
                {f.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">{f.name}</p>
                <div className="mt-1 flex flex-col gap-0.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {f.village ?? '—'}</span>
                  <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3" /> {f.fpoName ?? '—'}</span>
                  {f.phone && <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {f.phone}</span>}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
