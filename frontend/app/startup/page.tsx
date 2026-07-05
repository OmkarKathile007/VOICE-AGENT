'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  Factory,
  Filter,
  Leaf,
  LineChart,
  Loader2,
  LogOut,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Trash2,
  Truck,
  UserRound,
  UsersRound,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, productsApi, type Order, type Product } from '@/lib/api';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-products';
import { cn } from '@/lib/utils';

type ProcurementLine = {
  product: Product;
  quantity: number;
};

type Notice = { message: string; tone: 'success' | 'error' } | null;

const districts = ['All districts', 'Mandya', 'Solapur', 'Kalaburagi', 'Tumakuru', 'Dindori', 'Latur'];
const prompts = [
  'Find Grade-A Bajra below ₹45/kg',
  'Show organic Ragi suppliers',
  'Recommend the most trusted SHGs',
  'Which crops should I list next?',
];

const getHourGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const supplierName = (p: Product) => p.verifiedByName ?? p.shgId ?? p.fpoName ?? p.farmerName ?? 'Verified supplier';

/* ── Shared light-theme primitives (aligned with the SHG dashboard) ───────────── */

function SectionHeader({ icon: Icon, title, subtitle, action }: {
  icon: LucideIcon; title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent, sub }: {
  label: string; value: React.ReactNode; icon: LucideIcon;
  accent: 'emerald' | 'sky' | 'amber' | 'violet'; sub?: string;
}) {
  const accents: Record<string, string> = {
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    sky: 'text-sky-600 bg-sky-50 border-sky-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    violet: 'text-violet-600 bg-violet-50 border-violet-100',
  };
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1.5 text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">{value}</p>
          {sub && <p className="mt-1 text-xs font-medium text-slate-400">{sub}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function StartupCommandCenter() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All districts');
  const [organicOnly, setOrganicOnly] = useState(false);

  const [procurement, setProcurement] = useState<ProcurementLine[]>([]);
  const [procurementStatus, setProcurementStatus] = useState('Draft RFQ');
  const [busyId, setBusyId] = useState<string | null>(null);

  const [assistantInput, setAssistantInput] = useState('');
  const [assistantReply, setAssistantReply] = useState(
    'Ask me to find verified supply, compare SHGs, or decide what to list next in your consumer store.',
  );
  const [notice, setNotice] = useState<Notice>(null);

  const notify = (message: string, tone: 'success' | 'error' = 'success') => {
    setNotice({ message, tone });
    window.setTimeout(() => setNotice(null), 3200);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'Startup') router.replace('/products');
  }, [authLoading, isAuthenticated, router, user?.role]);

  useEffect(() => {
    let mounted = true;
    setLoadingData(true);
    Promise.all([productsApi.getVerified(), ordersApi.getMyOrders()])
      .then(async ([verified, orderData]) => {
        if (!mounted) return;
        let list = verified;
        // Fall back to the public market feed, then to demo data, so the console is
        // never empty even before the backend is running.
        if (!list.length) {
          const market = await productsApi.getAll().catch(() => [] as Product[]);
          list = market.filter((p) => p.verificationStatus !== 'REJECTED' && p.inStock !== false);
        }
        if (!list.length) {
          setUsingFallback(true);
          list = FALLBACK_PRODUCTS;
        }
        setProducts(list);
        setOrders(orderData);
      })
      .catch(() => {
        if (!mounted) return;
        setUsingFallback(true);
        setProducts(FALLBACK_PRODUCTS);
      })
      .finally(() => {
        if (mounted) setLoadingData(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.category} ${product.origin ?? ''} ${product.village ?? ''} ${supplierName(product)}`.toLowerCase();
      const districtMatch = district === 'All districts' || text.includes(district.toLowerCase());
      const searchMatch = !search || text.includes(search.toLowerCase());
      const organicMatch = !organicOnly
        || product.certifications?.some((cert) => /organic/i.test(cert))
        || /organic/i.test(product.badge ?? '');
      return districtMatch && searchMatch && organicMatch;
    });
  }, [products, district, search, organicOnly]);

  const listedProducts = useMemo(() => products.filter((p) => p.listedInStore), [products]);
  const suppliers = useMemo(() => {
    const map = new Map<string, { name: string; district: string; trust: number; count: number }>();
    products.forEach((p) => {
      const name = supplierName(p);
      const existing = map.get(name);
      if (existing) existing.count += 1;
      else map.set(name, { name, district: p.origin ?? p.village ?? 'Regional', trust: Math.round(p.qualityScore ?? 90), count: 1 });
    });
    return Array.from(map.values()).sort((a, b) => b.trust - a.trust).slice(0, 5);
  }, [products]);

  const totalSupply = visibleProducts.reduce((sum, p) => sum + (Number.parseFloat(p.quantity ?? '') || 1), 0);
  const procurementTotal = procurement.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  /* ── Actions ──────────────────────────────────────────────────────────────── */

  const toggleStore = async (product: Product) => {
    const willList = !product.listedInStore;
    if (usingFallback) {
      // Demo mode (no backend): reflect the change locally so the flow is visible.
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, listedInStore: willList } : p)));
      notify(willList ? `${product.name} listed in the consumer store (demo)` : `${product.name} removed from the store (demo)`);
      return;
    }
    setBusyId(product.id);
    try {
      const updated = willList
        ? await productsApi.publishToStore(product.id)
        : await productsApi.unpublishFromStore(product.id);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p)));
      notify(willList ? `${product.name} is now live in the consumer store` : `${product.name} removed from the consumer store`);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Action failed', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const addProcurementLine = (product: Product) => {
    setProcurement((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + 100 } : line));
      }
      return [...current, { product, quantity: 500 }];
    });
    setProcurementStatus('Draft RFQ');
    notify(`${product.name} added to your bulk RFQ`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setProcurement((current) =>
      current
        .map((line) => (line.product.id === productId ? { ...line, quantity: Math.max(100, quantity) } : line))
        .filter((line) => line.quantity > 0),
    );
  };

  const removeProcurementLine = (productId: string) =>
    setProcurement((current) => current.filter((line) => line.product.id !== productId));

  const runAssistant = (value = assistantInput) => {
    const text = value.trim();
    if (!text) return;
    setAssistantInput(text);
    const lower = text.toLowerCase();
    const matches = visibleProducts.filter((product) => {
      const priceMatch = lower.includes('below') ? product.price <= 45 : true;
      const cropMatch = ['ragi', 'bajra', 'jowar', 'foxtail', 'kodo'].some(
        (crop) => lower.includes(crop) && product.name.toLowerCase().includes(crop),
      );
      const organicMatch = lower.includes('organic')
        ? product.certifications?.some((cert) => /organic/i.test(cert)) || /organic/i.test(product.badge ?? '')
        : true;
      const anyCrop = ['ragi', 'bajra', 'jowar', 'foxtail', 'kodo'].some((crop) => lower.includes(crop));
      return priceMatch && organicMatch && (cropMatch || !anyCrop);
    });
    const top = matches[0] ?? visibleProducts[0];
    setAssistantReply(
      top
        ? `Best match: ${top.name} from ${supplierName(top)} (${top.origin ?? top.village ?? 'verified cluster'}) at ${formatCurrency(top.price)}/kg — quality score ${Math.round(top.qualityScore ?? 90)}. ${top.listedInStore ? 'Already live in your store.' : 'Tap “List in store” to publish it to consumers.'}`
        : 'No verified supply matched that. Try widening the district, price, or certification filters.',
    );
  };

  if (authLoading || !isAuthenticated || user?.role !== 'Startup') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* ── Announcement bar ── */}
      <div className="flex items-center justify-center gap-2 bg-emerald-800 px-4 py-2 text-center text-xs font-medium tracking-wide text-emerald-50">
        <ShieldCheck className="h-3.5 w-3.5" />
        Startup Console — source SHG-verified produce and publish it to the consumer marketplace.
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <button onClick={() => router.push('/startup')} className="flex shrink-0 items-center gap-2">
            <span className="rounded-xl bg-emerald-600 p-2 text-white shadow-sm">
              <Leaf className="h-6 w-6" />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-xl font-extrabold leading-tight tracking-tight text-slate-900">KrishiShetra</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Startup Console</span>
            </span>
          </button>

          <div className="relative mx-2 hidden max-w-xl flex-1 md:block">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search verified produce, SHGs, districts…"
              className="w-full rounded-xl border-transparent bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/products')}
              className="hidden items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:flex"
            >
              <Store className="h-4 w-4" />
              Consumer Market
            </button>
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-slate-50" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </button>
            <button
              onClick={() => router.push('/me/profile')}
              className="hidden items-center gap-2 text-slate-600 transition-colors hover:text-emerald-600 sm:flex"
            >
              <UserRound className="h-5 w-5" />
              <span className="text-sm font-semibold">{user.name}</span>
            </button>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Greeting ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {getHourGreeting()}, {user.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Browse produce your SHG partners have verified, then publish the best lots straight to the consumer marketplace.
            </p>
          </div>
          <button
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:self-auto"
          >
            View store front <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {/* ── Stats ── */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Verified produce" value={products.length} icon={PackageCheck} accent="emerald" sub="SHG-approved lots available" />
          <StatCard label="Live in store" value={listedProducts.length} icon={Store} accent="sky" sub="published to consumers" />
          <StatCard label="Bulk RFQ value" value={formatCurrency(procurementTotal)} icon={Truck} accent="amber" sub={`${procurement.length} products selected`} />
          <StatCard label="Orders" value={orders.length} icon={ShoppingBag} accent="violet" sub="procurement records" />
        </section>

        {/* ── AI copilot ── */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Procurement Copilot</h2>
                  <p className="text-xs text-slate-400">AI sourcing assistant</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') runAssistant(); }}
                  placeholder="What would you like to source today?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-200"
                />
                <button
                  onClick={() => runAssistant()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  <Sparkles className="h-4 w-4" /> Ask
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => runAssistant(prompt)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm leading-6 text-emerald-900 lg:w-80">
              {assistantReply}
            </div>
          </div>
        </section>

        {/* ── Verified marketplace + right rail ── */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* Verified produce */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={ShieldCheck}
              title="SHG-Verified Produce"
              subtitle={`${visibleProducts.length} lots ready to source & list`}
              action={
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(event) => setDistrict(event.target.value)}
                      className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      {districts.map((item) => <option key={item}>{item}</option>)}
                    </select>
                    <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
                  </div>
                  <button
                    onClick={() => setOrganicOnly((value) => !value)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold shadow-sm transition-colors',
                      organicOnly ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <Filter className="h-4 w-4" /> Organic
                  </button>
                </div>
              }
            />

            {loadingData ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="aspect-16/10 bg-slate-100" />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 rounded bg-slate-100" />
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                      <div className="h-8 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-16 text-center">
                <PackageCheck className="mb-3 h-10 w-10 text-slate-300" />
                <h3 className="text-base font-bold text-slate-700">No verified produce matches your filters</h3>
                <p className="mt-1 text-sm text-slate-400">Try clearing the district, organic, or search filters.</p>
              </div>
            ) : (
              <div className="grid max-h-[720px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                {visibleProducts.map((product) => {
                  const listed = !!product.listedInStore;
                  const busy = busyId === product.id;
                  return (
                    <article
                      key={product.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-slate-50 to-emerald-50/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(event) => { (event.target as HTMLImageElement).src = '/foxtail1.jpg'; }}
                        />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm">
                          <ShieldCheck className="h-3 w-3" /> {product.certifications?.[0] ?? 'SHG Verified'}
                        </span>
                        {listed && (
                          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            <Store className="h-3 w-3" /> Live
                          </span>
                        )}
                      </div>

                      <div className="flex grow flex-col p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">{product.category}</p>
                            <h3 className="mt-0.5 truncate text-[15px] font-bold text-slate-800">{product.name}</h3>
                          </div>
                          <p className="whitespace-nowrap text-right text-lg font-extrabold text-slate-900">
                            {formatCurrency(product.price)}<span className="text-xs font-medium text-slate-400">/kg</span>
                          </p>
                        </div>

                        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                          <UsersRound className="h-3.5 w-3.5 text-emerald-500" /> {supplierName(product)}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
                            <MapPin className="h-3 w-3" /> {product.village ?? product.origin ?? 'Regional'}
                          </span>
                          {product.quantity && <span className="rounded-full bg-slate-100 px-2 py-0.5">{product.quantity}</span>}
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                            <Star className="h-3 w-3" fill="currentColor" /> {Math.round(product.qualityScore ?? 90)}
                          </span>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => toggleStore(product)}
                            disabled={busy}
                            className={cn(
                              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold shadow-sm transition-colors disabled:opacity-60',
                              listed
                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700',
                            )}
                          >
                            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : listed ? <CheckCircle2 className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                            {listed ? 'Listed' : 'List in store'}
                          </button>
                          <button
                            onClick={() => addProcurementLine(product)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                          >
                            <Plus className="h-4 w-4" /> RFQ
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="flex flex-col gap-6">
            {/* Live in consumer store */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader
                icon={Store}
                title="Live in Consumer Store"
                subtitle={`${listedProducts.length} product${listedProducts.length === 1 ? '' : 's'} published`}
                action={
                  <button
                    onClick={() => router.push('/products')}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
                  >
                    Open <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                }
              />
              {listedProducts.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-400">
                  Nothing listed yet. Tap <span className="font-bold text-slate-600">“List in store”</span> on any verified lot to publish it to consumers.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {listedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/foxtail1.jpg'; }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(product.price)}/kg · {product.origin ?? product.village ?? 'Verified'}</p>
                      </div>
                      <button
                        onClick={() => toggleStore(product)}
                        disabled={busyId === product.id}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
                        aria-label="Remove from store"
                      >
                        {busyId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trusted suppliers */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeader icon={UsersRound} title="Trusted Suppliers" subtitle="Top SHGs by quality score" />
              <div className="space-y-2">
                {suppliers.map((supplier) => (
                  <div key={supplier.name} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">
                        {supplier.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">{supplier.name}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-400"><Factory className="h-3 w-3" /> {supplier.district} · {supplier.count} lot{supplier.count === 1 ? '' : 's'}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" /> {supplier.trust}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Bulk procurement + Market intelligence ── */}
        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          {/* RFQ cart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader
              icon={Truck}
              title="Bulk Procurement"
              subtitle="Assemble a bulk RFQ from verified lots"
              action={<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{procurementStatus}</span>}
            />
            <div className="mb-4 flex items-baseline justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-500">Cart total</span>
              <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(procurementTotal)}</span>
            </div>
            {procurement.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-400">
                Add verified produce with the <span className="font-bold text-slate-600">RFQ</span> button to build a bulk request.
              </div>
            ) : (
              <div className="space-y-2.5">
                {procurement.map((line) => (
                  <div key={line.product.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_110px_110px_auto]">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{line.product.name}</p>
                      <p className="text-xs text-slate-400">{formatCurrency(line.product.price)}/kg · {line.product.origin ?? line.product.village ?? 'Verified'}</p>
                    </div>
                    <input
                      type="number"
                      min={100}
                      step={100}
                      value={line.quantity}
                      onChange={(event) => updateQuantity(line.product.id, Number(event.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <p className="text-right text-sm font-extrabold text-emerald-700 sm:text-left">{formatCurrency(line.quantity * line.product.price)}</p>
                    <button
                      onClick={() => removeProcurementLine(line.product.id)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Remove line"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => setProcurementStatus('Quotation generated')}
                disabled={!procurement.length}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Generate Quotation
              </button>
              <button
                onClick={() => setProcurementStatus('Bulk request placed')}
                disabled={!procurement.length}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Place Bulk Request
              </button>
            </div>
          </div>

          {/* Market intelligence */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionHeader icon={BarChart3} title="Market Intelligence" subtitle="Signals from current verified supply" />
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700">Price trend (₹/kg)</h3>
                <LineChart className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex h-32 items-end gap-2">
                {[42, 58, 49, 68, 61, 78, 72, 88].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-lg bg-linear-to-t from-emerald-500 to-emerald-300" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <Wheat className="mb-2 h-5 w-5 text-emerald-500" />
                <p className="text-2xl font-extrabold text-slate-900">{totalSupply.toFixed(1)}</p>
                <p className="text-xs text-slate-400">units of supply available</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <CircleDollarSign className="mb-2 h-5 w-5 text-emerald-500" />
                <p className="text-2xl font-extrabold text-slate-900">18%</p>
                <p className="text-xs text-slate-400">demand lift forecast</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="mb-1 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-emerald-900">Scheme suggestions</h3>
              </div>
              <p className="text-sm leading-6 text-emerald-800/80">
                PMFME, ODOP and the National Millet Mission incentives match your current sourcing basket — apply for processing and packaging support.
              </p>
            </div>
          </div>
        </section>

        {usingFallback && (
          <p className="mt-6 text-center text-xs text-slate-400">
            Showing demo produce — connect the backend to load live SHG-verified listings.
          </p>
        )}
      </div>

      {/* ── Toast ── */}
      {notice && (
        <div
          className={cn(
            'fixed bottom-6 left-1/2 z-60 flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg animate-in fade-in slide-in-from-bottom-2',
            notice.tone === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white',
          )}
        >
          {notice.tone === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {notice.message}
        </div>
      )}
    </main>
  );
}
