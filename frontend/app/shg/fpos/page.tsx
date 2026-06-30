'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { shgApi, type FarmerUser, type Product } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { PageHeader, Loading, EmptyState } from '@/components/shg/primitives';
import { Building2, Users, Package, Clock } from 'lucide-react';

interface FpoRow {
  id: string;
  name: string;
  farmers: number;
  total: number;
  pending: number;
}

export default function FposPage() {
  const toast = useToast();
  const [farmers, setFarmers] = useState<FarmerUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [fm, pend, appr, rej] = await Promise.all([
          shgApi.farmers(), shgApi.pendingProducts(), shgApi.approvedProducts(), shgApi.rejectedProducts(),
        ]);
        setFarmers(fm);
        setProducts([...pend, ...appr, ...rej]);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to load FPOs');
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo<FpoRow[]>(() => {
    const map = new Map<string, FpoRow>();
    const key = (id?: string, name?: string) => id || name || 'unassigned';
    for (const f of farmers) {
      const k = key(f.fpoId, f.fpoName);
      const r = map.get(k) ?? { id: k, name: f.fpoName ?? 'Unassigned FPO', farmers: 0, total: 0, pending: 0 };
      r.farmers += 1;
      map.set(k, r);
    }
    for (const p of products) {
      const k = key(p.fpoId, p.fpoName);
      const r = map.get(k) ?? { id: k, name: p.fpoName ?? 'Unassigned FPO', farmers: 0, total: 0, pending: 0 };
      r.total += 1;
      if (p.verificationStatus === 'PENDING_SHG_VERIFICATION') r.pending += 1;
      map.set(k, r);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [farmers, products]);

  if (loading) return <Loading label="Loading FPOs…" />;

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader icon={Building2} title="Mapped FPOs" subtitle="Producer organizations your SHG verifies for." />

      {rows.length === 0 ? (
        <EmptyState title="No FPOs mapped" hint="Farmers and their listings are grouped by FPO here." icon={Building2} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">{r.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-sky-50 p-2.5">
                  <p className="flex items-center justify-center gap-1 text-lg font-extrabold text-sky-700"><Users className="h-3.5 w-3.5" />{r.farmers}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Farmers</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5">
                  <p className="flex items-center justify-center gap-1 text-lg font-extrabold text-slate-700"><Package className="h-3.5 w-3.5" />{r.total}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Listings</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-2.5">
                  <p className="flex items-center justify-center gap-1 text-lg font-extrabold text-amber-700"><Clock className="h-3.5 w-3.5" />{r.pending}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Pending</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
