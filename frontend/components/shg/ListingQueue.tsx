'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Product, shgApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { ListingCard } from './ListingCard';
import { Loading, EmptyState } from './primitives';
import { VerifyDialog, type VerifyMode } from './VerifyDialog';
import { Search, ChevronLeft, ChevronRight, ClipboardCheck, PackageCheck, PackageX } from 'lucide-react';

type Kind = 'pending' | 'approved' | 'rejected';

const CONFIG: Record<Kind, {
  fetch: () => Promise<Product[]>;
  empty: { title: string; hint: string; icon: typeof ClipboardCheck };
}> = {
  pending: {
    fetch: shgApi.pendingProducts,
    empty: { title: 'No listings awaiting verification', hint: 'New farmer listings will appear here for review.', icon: ClipboardCheck },
  },
  approved: {
    fetch: shgApi.approvedProducts,
    empty: { title: 'No approved listings yet', hint: 'Listings you approve are published to the marketplace and shown here.', icon: PackageCheck },
  },
  rejected: {
    fetch: shgApi.rejectedProducts,
    empty: { title: 'No rejected listings', hint: 'Listings you return to farmers for correction appear here.', icon: PackageX },
  },
};

const PAGE_SIZE = 9;
const SORTS = ['Newest', 'Oldest', 'Quality: High', 'Price: High', 'Price: Low'] as const;

export function ListingQueue({ kind }: { kind: Kind }) {
  const toast = useToast();
  const cfg = CONFIG[kind];

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('Newest');
  const [page, setPage] = useState(1);

  const [dialog, setDialog] = useState<{ mode: VerifyMode; product: Product } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await cfg.fetch());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [kind]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((p) =>
      !q ||
      [p.name, p.crop, p.farmerName, p.village, p.fpoName].some((f) => f?.toLowerCase().includes(q)),
    );
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'Oldest': return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
        case 'Quality: High': return (b.qualityScore ?? 0) - (a.qualityScore ?? 0);
        case 'Price: High': return b.price - a.price;
        case 'Price: Low': return a.price - b.price;
        default: return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
      }
    });
    return list;
  }, [items, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, sort]);

  // ── Optimistic approve / reject ─────────────────────────────────────────────
  const runVerify = async (mode: VerifyMode, reason?: string, remark?: string) => {
    if (!dialog) return;
    const product = dialog.product;
    setSubmitting(true);
    const snapshot = items;
    // optimistic: remove from the pending queue immediately
    setItems((prev) => prev.filter((p) => p.id !== product.id));
    try {
      if (mode === 'approve') {
        await shgApi.approve(product.id, remark);
        toast.success(`${product.name} approved — now live on the marketplace.`);
      } else {
        await shgApi.reject(product.id, reason!, remark);
        toast.success(`${product.name} returned to the farmer.`);
      }
      setDialog(null);
    } catch (e) {
      setItems(snapshot); // rollback
      toast.error(e instanceof Error ? e.message : 'Action failed, please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading label="Loading listings…" />;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, farmer, village…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        search ? (
          <EmptyState title={`No matches for “${search}”`} hint="Try a different crop, farmer or village." icon={Search} />
        ) : (
          <EmptyState {...cfg.empty} />
        )
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((p) => (
              <ListingCard
                key={p.id}
                product={p}
                onApprove={(prod) => setDialog({ mode: 'approve', product: prod })}
                onReject={(prod) => setDialog({ mode: 'reject', product: prod })}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-sm font-semibold text-slate-600">{safePage} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <VerifyDialog
        open={!!dialog}
        mode={dialog?.mode ?? 'approve'}
        product={dialog?.product ?? null}
        submitting={submitting}
        onClose={() => !submitting && setDialog(null)}
        onApprove={(remark) => runVerify('approve', undefined, remark)}
        onReject={(reason, remark) => runVerify('reject', reason, remark)}
      />
    </div>
  );
}
