
'use client';

import React, { useState, useEffect } from 'react';
import { api, Listing } from '@/lib/api';
import { ListingCard } from '@/components/ListingCard';
import { NeonButton } from '@/components/NeonButton';
import { GlassCard } from '@/components/GlassCard';
import {
  Plus, X, Sprout, Loader2, Trash2, Database,
  AlertCircle, MapPin, Package, IndianRupee, Leaf,
  TrendingUp, Wheat, Filter, Search
} from 'lucide-react';

/* ─── Stat pill ──────────────────────────────────────────────────────────── */
function StatPill({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: any; color: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border ${color} bg-white/60 backdrop-blur-sm`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold ml-1">{value}</span>
    </div>
  );
}

/* ─── Listing card (redesigned) ─────────────────────────────────────────── */
function CropCard({ item, onDelete }: { item: Listing; onDelete: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const isVoice = item.source === 'voice';

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease',
        boxShadow: hovered
          ? '0 20px 60px -10px rgba(21,128,61,0.25), 0 4px 20px rgba(0,0,0,0.08)'
          : '0 2px 16px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card bg with grain texture */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px',
        }}
      />

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-500"
        style={{
          background: hovered
            ? 'linear-gradient(90deg, #15803d, #84cc16, #ca8a04)'
            : 'linear-gradient(90deg, #15803d, #16a34a)',
        }}
      />

      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: hovered ? '#f0fdf4' : '#f7fee7',
                border: '1.5px solid',
                borderColor: hovered ? '#86efac' : '#d9f99d',
              }}
            >
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight capitalize">{item.crop}</h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mt-0.5 inline-block"
                style={{
                  background: isVoice ? '#fef3c7' : '#f0f9ff',
                  color: isVoice ? '#92400e' : '#075985',
                }}
              >
                {isVoice ? '🎙 Voice' : '✏️ Manual'}
              </span>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => { e.stopPropagation(); item.id && onDelete(item.id); }}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-50 text-gray-300 hover:text-red-500"
            title="Remove listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Price — hero element */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-5 h-5 text-green-700 mb-0.5" />
            <span
              className="text-3xl font-black tracking-tight"
              style={{ color: '#15803d', fontVariantNumeric: 'tabular-nums' }}
            >
              {Number(item.price).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400 ml-1 font-medium">per unit</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-4" />

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Package className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-gray-600">{item.quantity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-semibold text-gray-600">{item.location}</span>
          </div>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: '#f0fdf4', color: '#16a34a' }}
          >
            <TrendingUp className="w-3 h-3" />
            Live
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-green-800 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls = `w-full px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-800
  placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20
  transition-all duration-200 text-sm font-medium`;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ListingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ crop: '', quantity: '', price: '', location: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => { loadListings(); }, []);

  const loadListings = async () => {
    setLoading(true);
    const data = await api.getListings();
    setListings(data);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    const newItem = await api.createListing({ ...formData, source: 'manual', imageUrl });
    if (newItem) {
      setListings([newItem, ...listings]);
      setFormData({ crop: '', quantity: '', price: '', location: '' });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this listing?')) return;
    const success = await api.deleteListing(id);
    if (success) setListings(listings.filter(l => l.id !== id));
  };

  const filtered = listings.filter(l =>
    !search || l.crop?.toLowerCase().includes(search.toLowerCase()) || l.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: 'linear-gradient(160deg, #f0fdf4 0%, #fefce8 45%, #f7fee7 100%)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,600;1,500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .card-stagger:nth-child(1) { animation-delay: 0ms; }
        .card-stagger:nth-child(2) { animation-delay: 60ms; }
        .card-stagger:nth-child(3) { animation-delay: 120ms; }
        .card-stagger:nth-child(4) { animation-delay: 180ms; }
        .card-stagger:nth-child(5) { animation-delay: 240ms; }
        .card-stagger:nth-child(6) { animation-delay: 300ms; }
        .shimmer-text {
          background: linear-gradient(90deg, #15803d 0%, #4ade80 40%, #ca8a04 60%, #15803d 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ── Hero Header ── */}
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          {/* Decorative leaf bg */}
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-10"
            style={{
              background: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 70%, #16a34a 100%)',
              boxShadow: '0 24px 80px -12px rgba(21,128,61,0.4)',
            }}
          >
            {/* SVG leaf pattern bg */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 5 C20 5 5 20 5 40 C5 20 20 5 40 5 Z M40 5 C60 5 75 20 75 40 C75 20 60 5 40 5Z' fill='white'/%3E%3Cpath d='M40 75 C20 75 5 60 5 40 C5 60 20 75 40 75 Z M40 75 C60 75 75 60 75 40 C75 60 60 75 40 75Z' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '80px',
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-green-100 text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse" />
                    Market Live
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-green-200 text-[11px] font-bold uppercase tracking-widest">
                    <Wheat className="w-3 h-3" />
                    Kharif Season 2025
                  </span>
                </div>
                <h1
                  className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight mb-2"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Active Listings
                </h1>
                <p className="text-green-200 text-sm font-medium">
                  {listings.length} crops listed across {[...new Set(listings.map(l => l.location))].length} markets
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-white">{listings.length}</span>
                  <span className="text-[10px] font-semibold text-green-200 uppercase tracking-widest mt-0.5">Total</span>
                </div>
                <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-lime-300">
                    {listings.filter(l => l.source === 'voice').length}
                  </span>
                  <span className="text-[10px] font-semibold text-green-200 uppercase tracking-widest mt-0.5">Voice</span>
                </div>
                <div className="flex flex-col items-center px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className="text-2xl font-black text-amber-300">
                    {[...new Set(listings.map(l => l.location))].length}
                  </span>
                  <span className="text-[10px] font-semibold text-green-200 uppercase tracking-widest mt-0.5">Markets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crop or market..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-green-200 bg-white text-gray-700 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-green-200 bg-white text-gray-600 text-sm font-semibold hover:border-green-400 hover:text-green-700 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                  boxShadow: '0 4px 20px rgba(21,128,61,0.35)',
                }}
              >
                <Plus className="w-4 h-4" />
                New Listing
              </button>
            )}
          </div>
        </div>

        {/* ── Create Form ── */}
        {showForm && (
          <div className="animate-scale-in rounded-2xl overflow-hidden shadow-2xl"
            style={{ boxShadow: '0 24px 80px -12px rgba(21,128,61,0.2)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-lime-300" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base" style={{ fontFamily: "'Lora', serif" }}>
                    Add New Crop Listing
                  </h3>
                  <p className="text-green-300 text-xs">Fill in your produce details</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-6 md:p-8">
              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <Field label="Crop / Produce Name">
                    <input required type="text" placeholder="e.g. Basmati Rice" className={inputCls}
                      value={formData.crop} onChange={e => setFormData({ ...formData, crop: e.target.value })} />
                  </Field>
                  <Field label="Quantity Available">
                    <input required type="text" placeholder="e.g. 100 kg" className={inputCls}
                      value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                  </Field>
                  <Field label="Price per Unit (₹)">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 font-bold text-sm">₹</span>
                      <input required type="number" placeholder="5000" className={`${inputCls} pl-8`}
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                  </Field>
                  <Field label="Market Location">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                      <input required type="text" placeholder="e.g. Pune APMC" className={`${inputCls} pl-10`}
                        value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                  </Field>
                  <Field label="Product Image (optional)">
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-green-300 bg-green-50 cursor-pointer hover:border-green-500 transition-colors text-sm text-green-700 font-medium">
                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        {imageFile ? imageFile.name : 'Upload image'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                      {imagePreview && (
                        <img src={imagePreview} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-green-200" />
                      )}
                    </div>
                  </Field>
                </div>

                <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-300 hover:text-gray-700 transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)', boxShadow: '0 4px 16px rgba(21,128,61,0.3)' }}
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Sprout className="w-4 h-4" /> Publish Listing</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
              <Leaf className="absolute inset-0 m-auto w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-700 text-sm font-semibold">Loading market data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-green-200 bg-white/50 text-center animate-fade-up"
          >
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
              <Sprout className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1" style={{ fontFamily: "'Lora', serif" }}>
              {search ? 'No crops found' : 'No listings yet'}
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              {search
                ? `No results for "${search}". Try a different crop or market name.`
                : 'Start by adding your first crop listing or use the Voice Assistant to dictate it.'}
            </p>
            {!search && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #15803d, #16a34a)' }}
              >
                <Plus className="w-4 h-4" /> Add First Listing
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="animate-fade-up card-stagger"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CropCard item={item} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

        {/* ── Footer note ── */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 font-medium pb-4">
            Showing {filtered.length} of {listings.length} listings · Prices in INR · Updated live
          </p>
        )}
      </div>
    </div>
  );
}