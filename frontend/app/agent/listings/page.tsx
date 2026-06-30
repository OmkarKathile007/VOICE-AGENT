'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { productsApi, type Product, type VerificationStatus } from '@/lib/api';
import {
  Plus, X, Sprout, Loader2, MapPin, Package, IndianRupee, Leaf,
  Search, Wheat, Clock, CheckCircle2, XCircle, ChevronDown, Mic, History,
} from 'lucide-react';

/* ─── Status pill ───────────────────────────────────────────────────────────── */
const STATUS_META: Record<VerificationStatus, { label: string; cls: string; dot: string; icon: React.ElementType }> = {
  PENDING_SHG_VERIFICATION: { label: 'Pending SHG Verification', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: Clock },
  APPROVED: { label: 'Approved · Live', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  REJECTED: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', icon: XCircle },
};

function StatusPill({ status }: { status?: VerificationStatus }) {
  const m = STATUS_META[status ?? 'PENDING_SHG_VERIFICATION'];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${m.cls}`}>
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  );
}

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* ─── Listing card with verification timeline ───────────────────────────────── */
function ListingCard({ item }: { item: Product }) {
  const [open, setOpen] = useState(false);
  const status = item.verificationStatus as VerificationStatus | undefined;
  const isRejected = status === 'REJECTED';
  const isApproved = status === 'APPROVED';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime-200 bg-lime-50">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-base font-bold capitalize leading-tight text-gray-900">{item.name ?? item.crop}</h3>
              <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-green-600">
                <Sprout className="h-3 w-3" /> {item.crop ?? item.category}
              </span>
            </div>
          </div>
          <StatusPill status={status} />
        </div>

        <div className="mb-3 flex items-baseline gap-1">
          <IndianRupee className="mb-0.5 h-5 w-5 text-green-700" />
          <span className="text-2xl font-black tracking-tight text-green-700 tabular-nums">
            {item.expectedPrice ?? Number(item.price).toLocaleString('en-IN')}
          </span>
          <span className="ml-1 text-xs font-medium text-gray-400">expected</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-gray-600"><Package className="h-3.5 w-3.5 text-amber-500" />{item.quantity ?? '—'}</span>
          <span className="flex items-center gap-1.5 font-semibold text-gray-600"><MapPin className="h-3.5 w-3.5 text-rose-400" />{item.village ?? item.origin ?? '—'}</span>
          <span className="text-gray-400">{fmtDate(item.createdAt)}</span>
        </div>
      </div>

      {/* SHG feedback */}
      {isRejected && (
        <div className="border-t border-rose-100 bg-rose-50/60 px-5 py-3">
          <p className="text-xs font-bold text-rose-700">Correction needed: {item.rejectionReason}</p>
          {item.verificationRemark && <p className="mt-1 text-xs text-rose-600/90">{item.verificationRemark}</p>}
          <p className="mt-1 text-[11px] text-rose-400">Reviewed {fmtDate(item.verifiedAt)} — you can update and resubmit.</p>
        </div>
      )}
      {isApproved && (
        <div className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-3">
          <p className="text-xs font-bold text-emerald-700">Verified &amp; published to the marketplace.</p>
          {item.verificationRemark && <p className="mt-1 text-xs text-emerald-600/90">“{item.verificationRemark}”</p>}
          <p className="mt-1 text-[11px] text-emerald-500">Approved {fmtDate(item.verifiedAt)}</p>
        </div>
      )}

      {/* Timeline toggle */}
      {item.verificationHistory && item.verificationHistory.length > 0 && (
        <div className="border-t border-gray-100">
          <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-2.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-50">
            <span className="flex items-center gap-1.5"><History className="h-3.5 w-3.5" /> Verification timeline</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <ol className="relative space-y-4 border-l border-gray-200 px-5 pb-4 pl-8">
              {item.verificationHistory.map((ev, i) => {
                const color = ev.action === 'APPROVED' ? 'bg-emerald-500' : ev.action === 'REJECTED' ? 'bg-rose-500' : 'bg-gray-400';
                return (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[1.65rem] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white ${color}`} />
                    <p className="text-xs font-bold text-gray-800">
                      {ev.action === 'CREATED' ? 'Submitted for verification' : ev.action === 'APPROVED' ? 'Approved by SHG' : ev.action === 'REJECTED' ? 'Returned for correction' : ev.action}
                    </p>
                    <p className="text-[11px] text-gray-400">{ev.actorName ?? ev.actorEmail} · {fmtDate(ev.at)}</p>
                    {ev.reason && <p className="text-[11px] font-semibold text-rose-600">Reason: {ev.reason}</p>}
                    {ev.remark && <p className="text-[11px] text-gray-500">{ev.remark}</p>}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Input field ───────────────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-widest text-green-800">{label}</label>
      {children}
    </div>
  );
}
const inputCls = `w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-800
  placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
  transition-all duration-200 text-sm font-medium`;

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default function MyListingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | VerificationStatus>('all');
  const [formData, setFormData] = useState({ crop: '', quantity: '', price: '', location: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadListings(); }, []);

  const loadListings = async () => {
    setLoading(true);
    setListings(await productsApi.getMyListings());
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else setImagePreview(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    try {
      const created = await productsApi.createFarmerListing({ ...formData, source: 'manual', imageUrl });
      setListings([created, ...listings]);
      setFormData({ crop: '', quantity: '', price: '', location: '' });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit listing. Are you signed in?');
    } finally {
      setSubmitting(false);
    }
  };

  const counts = useMemo(() => ({
    all: listings.length,
    PENDING_SHG_VERIFICATION: listings.filter((l) => l.verificationStatus === 'PENDING_SHG_VERIFICATION').length,
    APPROVED: listings.filter((l) => l.verificationStatus === 'APPROVED').length,
    REJECTED: listings.filter((l) => l.verificationStatus === 'REJECTED').length,
  }), [listings]);

  const filtered = useMemo(() => listings.filter((l) => {
    if (filter !== 'all' && l.verificationStatus !== filter) return false;
    const q = search.toLowerCase();
    return !q || l.crop?.toLowerCase().includes(q) || l.name?.toLowerCase().includes(q) || l.village?.toLowerCase().includes(q);
  }), [listings, filter, search]);

  return (
    <div className="min-h-screen w-full" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #fefce8 45%, #f7fee7 100%)', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,500&display=swap');`}</style>

      <div className="mx-auto max-w-7xl space-y-7 px-6 py-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 70%, #16a34a 100%)', boxShadow: '0 24px 80px -12px rgba(21,128,61,0.4)' }}>
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-green-100 backdrop-blur-sm">
                  <Mic className="h-3 w-3" /> Voice + Manual
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-green-200">
                  <Wheat className="h-3 w-3" /> Kharif Season 2025
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-black leading-none tracking-tight text-white md:text-5xl" style={{ fontFamily: "'Lora', serif" }}>My Listings</h1>
              <p className="text-sm font-medium text-green-200">Track each listing as your SHG verifies it before it goes live on the marketplace.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { n: counts.PENDING_SHG_VERIFICATION, l: 'Pending', c: 'text-amber-300' },
                { n: counts.APPROVED, l: 'Approved', c: 'text-lime-300' },
                { n: counts.REJECTED, l: 'Rejected', c: 'text-rose-300' },
              ].map((s) => (
                <div key={s.l} className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <span className={`text-2xl font-black ${s.c}`}>{s.n}</span>
                  <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-green-200">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search crop or village..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-green-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all placeholder:text-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([['all', 'All'], ['PENDING_SHG_VERIFICATION', 'Pending'], ['APPROVED', 'Approved'], ['REJECTED', 'Rejected']] as ['all' | VerificationStatus, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${filter === k ? 'border-green-400 bg-green-100 text-green-800' : 'border-green-200 bg-white text-gray-500 hover:bg-green-50'}`}>
                {l} <span className="opacity-60">({counts[k]})</span>
              </button>
            ))}
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="ml-auto flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' }}>
                <Plus className="h-4 w-4" /> New Listing
              </button>
            )}
          </div>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4" style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"><Sprout className="h-4 w-4 text-lime-300" /></div>
                <div>
                  <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>Add New Crop Listing</h3>
                  <p className="text-xs text-green-300">It will be sent to your SHG for verification.</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="bg-white p-6 md:p-8">
              <form onSubmit={handleCreate}>
                <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Crop / Produce Name">
                    <input required type="text" placeholder="e.g. Basmati Rice" className={inputCls} value={formData.crop} onChange={(e) => setFormData({ ...formData, crop: e.target.value })} />
                  </Field>
                  <Field label="Quantity Available">
                    <input required type="text" placeholder="e.g. 100 kg" className={inputCls} value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                  </Field>
                  <Field label="Expected Price (₹)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-green-600">₹</span>
                      <input required type="text" placeholder="5000" className={`${inputCls} pl-8`} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                  </Field>
                  <Field label="Village / Market">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
                      <input required type="text" placeholder="e.g. Pune APMC" className={`${inputCls} pl-10`} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                  </Field>
                  <Field label="Product Image (optional)">
                    <div className="flex items-center gap-3">
                      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-colors hover:border-green-500">
                        <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        {imageFile ? imageFile.name : 'Upload image'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                      {imagePreview && <img src={imagePreview} alt="preview" className="h-12 w-12 rounded-xl border border-green-200 object-cover" />}
                    </div>
                  </Field>
                </div>
                {error && <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</div>}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}>
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <><Sprout className="h-4 w-4" /> Submit for Verification</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-100 border-t-green-500" />
              <Leaf className="absolute inset-0 m-auto h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-green-700">Loading your listings…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-white/50 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-green-50"><Sprout className="h-8 w-8 text-green-400" /></div>
            <h3 className="mb-1 text-lg font-bold text-gray-700" style={{ fontFamily: "'Lora', serif" }}>{search || filter !== 'all' ? 'No matching listings' : 'No listings yet'}</h3>
            <p className="max-w-sm text-sm text-gray-400">{search || filter !== 'all' ? 'Try a different search or filter.' : 'Use the Voice Assistant or “New Listing” to add your first crop. It will be verified by your SHG before going live.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => <ListingCard key={item.id} item={item} />)}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="pb-4 text-center text-xs font-medium text-gray-400">
            Showing {filtered.length} of {listings.length} listings · Only approved listings appear on the marketplace
          </p>
        )}
      </div>
    </div>
  );
}
