'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';
import { StatusBadge, QualityMeter, CropImage } from './primitives';
import {
  MapPin, User, Building2, Package, IndianRupee, CheckCircle2, XCircle,
  Eye, Sprout, Clock,
} from 'lucide-react';

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ListingCard({
  product, onApprove, onReject,
}: {
  product: Product;
  onApprove?: (p: Product) => void;
  onReject?: (p: Product) => void;
}) {
  const isPending = product.verificationStatus === 'PENDING_SHG_VERIFICATION';

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <CropImage src={product.imageUrl} alt={product.name} className="h-24 w-24 shrink-0 rounded-xl border border-slate-100" />

        {/* Main */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-slate-800">{product.name}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <Sprout className="h-3.5 w-3.5" /> {product.crop ?? product.category}
              </p>
            </div>
            <StatusBadge status={product.verificationStatus} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-amber-500" /> {product.quantity ?? '—'}</span>
            <span className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-emerald-600" /> {product.expectedPrice ?? product.price}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-rose-400" /> {product.village ?? product.origin ?? '—'}</span>
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-sky-500" /> {product.farmerName ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="h-3.5 w-3.5" /> {product.fpoName ?? 'Unassigned FPO'}
          </span>
          <QualityMeter score={product.qualityScore} />
        </div>
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" /> {timeAgo(product.createdAt)}
        </span>
      </div>

      {/* Rejection / approval note */}
      {product.verificationStatus === 'REJECTED' && product.rejectionReason && (
        <div className="border-t border-rose-100 bg-rose-50/60 px-4 py-2 text-xs text-rose-700">
          <span className="font-bold">Rejected:</span> {product.rejectionReason}
          {product.verificationRemark ? ` — ${product.verificationRemark}` : ''}
        </div>
      )}
      {product.verificationStatus === 'APPROVED' && product.verificationRemark && (
        <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-2 text-xs text-emerald-700">
          <span className="font-bold">Verified:</span> {product.verificationRemark}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <Link
          href={`/shg/verify/${product.id}`}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" /> Review
        </Link>
        {product.farmerId && (
          <Link
            href={`/shg/farmers/${product.farmerId}`}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <User className="h-3.5 w-3.5" /> Farmer
          </Link>
        )}
        {isPending && (
          <>
            <button
              onClick={() => onReject?.(product)}
              className="ml-auto flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
            <button
              onClick={() => onApprove?.(product)}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
            </button>
          </>
        )}
      </div>
    </div>
  );
}
