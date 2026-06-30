'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, shgApi, type Product } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { Loading, StatusBadge, QualityMeter, CropImage } from '@/components/shg/primitives';
import { VerifyDialog, type VerifyMode } from '@/components/shg/VerifyDialog';
import {
  ArrowLeft, CheckCircle2, XCircle, User, MapPin, Building2, Phone, Mail,
  Package, IndianRupee, Sprout, Mic, Cpu, ShieldCheck, Award, Clock, FileText,
} from 'lucide-react';

function fmt(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="flex items-center gap-2 text-sm text-slate-500"><Icon className="h-4 w-4 text-slate-400" /> {label}</span>
      <span className="text-sm font-semibold text-slate-800">{value ?? '—'}</span>
    </div>
  );
}

export default function VerifyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<VerifyMode | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const p = await productsApi.getById(id);
    setProduct(p);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  const runVerify = async (mode: VerifyMode, reason?: string, remark?: string) => {
    if (!product) return;
    setSubmitting(true);
    try {
      const updated = mode === 'approve'
        ? await shgApi.approve(product.id, remark)
        : await shgApi.reject(product.id, reason!, remark);
      setProduct(updated);
      setDialog(null);
      toast.success(mode === 'approve' ? 'Listing approved — now live on the marketplace.' : 'Listing returned to the farmer.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action failed, please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading label="Loading listing…" />;
  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-semibold text-slate-500">Listing not found.</p>
        <Link href="/shg/pending" className="mt-3 inline-block text-sm font-bold text-emerald-600">← Back to pending</Link>
      </div>
    );
  }

  const isPending = product.verificationStatus === 'PENDING_SHG_VERIFICATION';
  const ai = product.aiExtractedFields ?? {};
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50">
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>
              <StatusBadge status={product.verificationStatus} />
            </div>
            <p className="mt-0.5 text-sm text-slate-500">Listing #{product.id?.slice(-6)} · created {fmt(product.createdAt)}</p>
          </div>
        </div>
        {isPending && (
          <div className="flex items-center gap-2">
            <button onClick={() => setDialog('reject')} className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100">
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button onClick={() => setDialog('approve')} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Approve
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — produce detail */}
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">Product Images</h2>
            {images.length === 0 ? (
              <CropImage src="" alt={product.name} className="h-56 w-full rounded-xl border border-slate-100" />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((src, i) => (
                  <CropImage key={i} src={src} alt={`${product.name} ${i + 1}`} className="aspect-square w-full rounded-xl border border-slate-100" />
                ))}
              </div>
            )}
          </div>

          {/* AI extracted */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Cpu className="h-4 w-4 text-emerald-500" /> AI-Extracted Information
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Sprout, label: 'Crop', value: product.crop },
                { icon: Package, label: 'Quantity', value: product.quantity },
                { icon: IndianRupee, label: 'Expected Price', value: product.expectedPrice ?? product.price },
                { icon: MapPin, label: 'Village', value: product.village },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400"><f.icon className="h-3.5 w-3.5" /> {f.label}</p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-800">{f.value ?? '—'}</p>
                </div>
              ))}
            </div>
            {Object.keys(ai).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(ai).map(([k, v]) => (
                  <span key={k} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                    <span className="font-bold text-slate-700">{k}:</span> {String(v)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Voice transcript */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Mic className="h-4 w-4 text-violet-500" /> AI Voice Transcript
            </h2>
            {product.voiceTranscript ? (
              <p className="rounded-xl border border-violet-100 bg-violet-50/50 p-4 text-sm leading-relaxed text-slate-600">“{product.voiceTranscript}”</p>
            ) : (
              <p className="text-sm text-slate-400">No voice transcript — this listing was entered manually.</p>
            )}
          </div>

          {/* Quality + certifications */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Quality Scan
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold tabular-nums text-slate-900">{product.qualityScore != null ? Math.round(product.qualityScore) : '—'}</span>
                <span className="text-sm text-slate-400">/ 100</span>
              </div>
              <div className="mt-2"><QualityMeter score={product.qualityScore} /></div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <Award className="h-4 w-4 text-amber-500" /> Certifications
              </h2>
              {product.certifications && product.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((c) => (
                    <span key={c} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{c}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">None declared.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right — farmer + timeline */}
        <div className="space-y-6">
          {/* Farmer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <User className="h-4 w-4 text-sky-500" /> Farmer Information
            </h2>
            <div className="divide-y divide-slate-100">
              <InfoRow icon={User} label="Name" value={product.farmerName} />
              <InfoRow icon={Mail} label="Email" value={product.farmerEmail} />
              <InfoRow icon={MapPin} label="Village" value={product.village} />
              <InfoRow icon={Building2} label="FPO" value={product.fpoName} />
            </div>
            {product.farmerId && (
              <Link href={`/shg/farmers/${product.farmerId}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50">
                <User className="h-4 w-4" /> View Farmer Profile
              </Link>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              <Clock className="h-4 w-4 text-slate-400" /> Verification Timeline
            </h2>
            <ol className="relative space-y-5 border-l border-slate-200 pl-5">
              {(product.verificationHistory ?? []).map((ev, i) => {
                const color = ev.action === 'APPROVED' ? 'bg-emerald-500' : ev.action === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-400';
                return (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[1.45rem] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${color}`} />
                    <p className="text-sm font-bold text-slate-800">
                      {ev.action === 'CREATED' ? 'Listing created' : ev.action === 'APPROVED' ? 'Approved' : ev.action === 'REJECTED' ? 'Rejected' : ev.action}
                    </p>
                    <p className="text-xs text-slate-400">{ev.actorName ?? ev.actorEmail} · {fmt(ev.at)}</p>
                    {ev.reason && <p className="mt-1 text-xs font-semibold text-rose-600">Reason: {ev.reason}</p>}
                    {ev.remark && <p className="mt-0.5 text-xs text-slate-500">{ev.remark}</p>}
                  </li>
                );
              })}
              {(product.verificationHistory ?? []).length === 0 && (
                <li className="relative">
                  <span className="absolute -left-[1.45rem] top-1 h-2.5 w-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                  <p className="text-sm text-slate-400">No history yet.</p>
                </li>
              )}
            </ol>
          </div>

          {/* Verifier note */}
          {!isPending && (
            <div className={`rounded-2xl border p-5 shadow-sm ${product.verificationStatus === 'APPROVED' ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'}`}>
              <h2 className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                <FileText className="h-4 w-4" /> Verification Outcome
              </h2>
              {product.rejectionReason && <p className="text-sm font-bold text-rose-700">{product.rejectionReason}</p>}
              {product.verificationRemark && <p className="mt-1 text-sm text-slate-600">{product.verificationRemark}</p>}
              <p className="mt-2 text-xs text-slate-400">By {product.verifiedByName ?? product.verifiedBy} · {fmt(product.verifiedAt)}</p>
            </div>
          )}
        </div>
      </div>

      <VerifyDialog
        open={!!dialog}
        mode={dialog ?? 'approve'}
        product={product}
        submitting={submitting}
        onClose={() => !submitting && setDialog(null)}
        onApprove={(remark) => runVerify('approve', undefined, remark)}
        onReject={(reason, remark) => runVerify('reject', reason, remark)}
      />
    </div>
  );
}
