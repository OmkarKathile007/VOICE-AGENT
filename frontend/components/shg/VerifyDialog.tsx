'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { REJECTION_REASONS, type Product } from '@/lib/api';

const APPROVE_PRESETS = ['Verified by SHG', 'Quality acceptable', 'Packaging verified'];

export type VerifyMode = 'approve' | 'reject';

export function VerifyDialog({
  open, mode, product, submitting, onClose, onApprove, onReject,
}: {
  open: boolean;
  mode: VerifyMode;
  product: Product | null;
  submitting: boolean;
  onClose: () => void;
  onApprove: (remark: string) => void;
  onReject: (reason: string, remark: string) => void;
}) {
  const [remark, setRemark] = useState('');
  const [reason, setReason] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) { setRemark(''); setReason(''); setTouched(false); }
  }, [open, product?.id, mode]);

  if (!mounted || !open || !product) return null;

  const isApprove = mode === 'approve';
  const reasonMissing = !isApprove && !reason;

  const submit = () => {
    if (isApprove) { onApprove(remark.trim()); return; }
    setTouched(true);
    if (!reason) return;
    onReject(reason, remark.trim());
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={submitting ? undefined : onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 ${isApprove ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <div className="flex items-center gap-2.5 text-white">
            {isApprove ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <h3 className="text-base font-bold">{isApprove ? 'Approve Listing' : 'Reject Listing'}</h3>
          </div>
          <button onClick={onClose} disabled={submitting} className="rounded-lg p-1 text-white/80 hover:bg-white/15 hover:text-white disabled:opacity-50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm text-slate-500">
            {isApprove ? 'Publishing ' : 'Returning '}
            <span className="font-bold text-slate-800">{product.name}</span>
            {isApprove ? ' to the marketplace.' : ' to the farmer for corrections.'}
          </p>

          {!isApprove && (
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-medium text-slate-800 outline-none transition-all focus:ring-2 ${
                  touched && reasonMissing ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:border-rose-400 focus:ring-rose-100'
                }`}
              >
                <option value="">Select a reason…</option>
                {REJECTION_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {touched && reasonMissing && <p className="mt-1 text-xs font-semibold text-rose-500">A reason is required to reject.</p>}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              {isApprove ? 'Remarks (optional)' : 'Additional remarks (optional)'}
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              placeholder={isApprove ? 'e.g. Quality acceptable, packaging verified…' : 'Guidance to help the farmer fix the listing…'}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            {isApprove && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {APPROVE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRemark((r) => (r ? `${r} · ${p}` : p))}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    + {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button onClick={onClose} disabled={submitting} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-60 ${
              isApprove ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : isApprove ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {isApprove ? 'Approve & Publish' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
