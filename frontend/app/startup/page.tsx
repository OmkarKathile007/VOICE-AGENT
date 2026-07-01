'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Factory,
  Filter,
  Heart,
  Leaf,
  LineChart,
  MapPin,
  Moon,
  PackageCheck,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
  UserRound,
  UsersRound,
  Wheat,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, productsApi, type Order, type Product } from '@/lib/api';
import { cn } from '@/lib/utils';

type Supplier = {
  id: string;
  name: string;
  role: 'Farmer' | 'FPO' | 'SHG';
  village: string;
  district: string;
  fpo: string;
  shg: string;
  trustScore: number;
  rating: number;
  ordersCompleted: number;
  certifications: string[];
  products: Product[];
};

type ProcurementLine = {
  product: Product;
  quantity: number;
};

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'startup-ragi',
    name: 'Organic Ragi',
    price: 42,
    imageUrl: '/ragi.jpg',
    category: 'Millets',
    origin: 'Mandya',
    badge: 'Organic',
    rating: 4.8,
    reviews: 218,
    inStock: true,
    farmerName: 'Kaveri SHG Collective',
    village: 'Hulikere',
    fpoName: 'Mandya Millet FPO',
    shgId: 'Kaveri SHG',
    qualityScore: 94,
    certifications: ['Organic', 'SHG Verified'],
    quantity: '8.5 MT',
    verificationStatus: 'APPROVED',
  },
  {
    id: 'startup-bajra',
    name: 'Grade-A Bajra',
    price: 39,
    imageUrl: '/pearlmillet.jpg',
    category: 'Millets',
    origin: 'Solapur',
    badge: 'Grade A',
    rating: 4.7,
    reviews: 164,
    inStock: true,
    farmerName: 'Bhumi Farmers Group',
    village: 'Barshi',
    fpoName: 'Solapur Dryland FPO',
    shgId: 'Annapurna SHG',
    qualityScore: 91,
    certifications: ['FPO Verified', 'Moisture Tested'],
    quantity: '12 MT',
    verificationStatus: 'APPROVED',
  },
  {
    id: 'startup-jowar',
    name: 'Premium Jowar',
    price: 36,
    imageUrl: '/jowar.jpg',
    category: 'Millets',
    origin: 'Kalaburagi',
    badge: 'Trending',
    rating: 4.6,
    reviews: 142,
    inStock: true,
    farmerName: 'Nava Jyoti SHG',
    village: 'Aland',
    fpoName: 'Kalaburagi FPO',
    shgId: 'Nava Jyoti SHG',
    qualityScore: 88,
    certifications: ['SHG Approved'],
    quantity: '6.2 MT',
    verificationStatus: 'APPROVED',
  },
  {
    id: 'startup-foxtail',
    name: 'Foxtail Millet',
    price: 58,
    imageUrl: '/foxtail1.jpg',
    category: 'Millets',
    origin: 'Tumakuru',
    badge: 'New',
    rating: 4.9,
    reviews: 96,
    inStock: true,
    farmerName: 'Siri Farmer Producer Group',
    village: 'Sira',
    fpoName: 'Tumakuru Millet FPO',
    shgId: 'Siri SHG',
    qualityScore: 96,
    certifications: ['Organic', 'Lab Tested'],
    quantity: '4.8 MT',
    verificationStatus: 'APPROVED',
  },
];

const districts = ['All districts', 'Mandya', 'Solapur', 'Kalaburagi', 'Tumakuru'];
const prompts = [
  'Find Grade-A Bajra below Rs 45/kg',
  'Find organic Ragi suppliers',
  'Show suppliers within 100km',
  'Recommend trusted SHGs',
  "Predict next month's prices",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const getHourGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const cleanProducts = (products: Product[]) =>
  products.filter((product) => product.verificationStatus !== 'REJECTED' && product.inStock !== false);

const buildSuppliers = (products: Product[]): Supplier[] => {
  const source = products.length ? products : FALLBACK_PRODUCTS;
  return source.slice(0, 6).map((product, index) => ({
    id: product.farmerId ?? product.id,
    name: product.farmerName ?? product.fpoName ?? product.shgId ?? `${product.origin ?? 'Regional'} Supplier`,
    role: index % 3 === 0 ? 'SHG' : index % 2 === 0 ? 'FPO' : 'Farmer',
    village: product.village ?? ['Hulikere', 'Barshi', 'Aland', 'Sira'][index % 4],
    district: product.origin ?? ['Mandya', 'Solapur', 'Kalaburagi', 'Tumakuru'][index % 4],
    fpo: product.fpoName ?? 'Regional Millet FPO',
    shg: product.shgId ?? 'Verified SHG Cluster',
    trustScore: product.qualityScore ?? 86 + (index % 5) * 3,
    rating: product.rating ?? 4.5,
    ordersCompleted: 38 + index * 17,
    certifications: product.certifications?.length ? product.certifications : ['FPO Verified', 'Quality Checked'],
    products: [product],
  }));
};

const formatCurrency = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;

export default function StartupCommandCenter() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [query, setQuery] = useState('');
  const [marketplaceQuery, setMarketplaceQuery] = useState('');
  const [district, setDistrict] = useState('All districts');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [procurement, setProcurement] = useState<ProcurementLine[]>([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantReply, setAssistantReply] = useState('Ready to source verified supply across Farmers, FPOs, and SHGs.');
  const [darkMode, setDarkMode] = useState(true);
  const [procurementStatus, setProcurementStatus] = useState('Draft RFQ');

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
    Promise.all([productsApi.getAll(), ordersApi.getMyOrders()])
      .then(([productData, orderData]) => {
        if (!mounted) return;
        const approved = cleanProducts(productData);
        setProducts(approved.length ? approved : FALLBACK_PRODUCTS);
        setOrders(orderData);
      })
      .catch(() => {
        if (!mounted) return;
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
    const source = products.length ? products : FALLBACK_PRODUCTS;
    return source.filter((product) => {
      const text = `${product.name} ${product.category} ${product.origin ?? ''} ${product.village ?? ''} ${product.farmerName ?? ''}`.toLowerCase();
      const districtMatch = district === 'All districts' || text.includes(district.toLowerCase());
      const searchMatch = !marketplaceQuery || text.includes(marketplaceQuery.toLowerCase());
      const organicMatch = !organicOnly || product.certifications?.some((cert) => /organic/i.test(cert)) || /organic/i.test(product.badge ?? '');
      return districtMatch && searchMatch && organicMatch;
    });
  }, [district, marketplaceQuery, organicOnly, products]);

  const suppliers = useMemo(() => buildSuppliers(products), [products]);
  const activeSupplier = selectedSupplier ?? suppliers[0];
  const totalSupply = visibleProducts.reduce((sum, product) => sum + Number.parseFloat(product.quantity ?? '1'), 0);
  const procurementTotal = procurement.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const feed = useMemo(() => {
    const productFeed = visibleProducts.slice(0, 5).map((product, index) => ({
      label: index % 2 === 0 ? 'New farmer listing' : 'SHG approved product',
      title: product.name,
      meta: `${product.village ?? product.origin ?? 'Verified cluster'} - ${formatCurrency(product.price)}/kg`,
    }));
    return [
      ...productFeed,
      { label: 'Trending product', title: 'Foxtail Millet demand up 18%', meta: 'High pull from Bengaluru buyers' },
      { label: 'Latest certification', title: '12 lots cleared moisture test', meta: 'Updated this morning' },
      { label: 'Newest village', title: 'Hulikere cluster onboarded', meta: '3 new SHG products live' },
    ].slice(0, 7);
  }, [visibleProducts]);

  const addProcurementLine = (product: Product) => {
    setProcurement((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) => (line.product.id === product.id ? { ...line, quantity: line.quantity + 100 } : line));
      }
      return [...current, { product, quantity: 500 }];
    });
    setProcurementStatus('Draft RFQ');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setProcurement((current) =>
      current
        .map((line) => (line.product.id === productId ? { ...line, quantity: Math.max(100, quantity) } : line))
        .filter((line) => line.quantity > 0),
    );
  };

  const runAssistant = (value = assistantInput) => {
    const text = value.trim();
    if (!text) return;
    setAssistantInput(text);
    const lower = text.toLowerCase();
    const matches = visibleProducts.filter((product) => {
      const priceMatch = lower.includes('below') ? product.price <= 45 : true;
      const cropMatch = ['ragi', 'bajra', 'jowar', 'foxtail'].some((crop) => lower.includes(crop) && product.name.toLowerCase().includes(crop));
      const organicMatch = lower.includes('organic')
        ? product.certifications?.some((cert) => /organic/i.test(cert)) || /organic/i.test(product.badge ?? '')
        : true;
      return priceMatch && organicMatch && (cropMatch || !['ragi', 'bajra', 'jowar', 'foxtail'].some((crop) => lower.includes(crop)));
    });
    const top = matches[0] ?? visibleProducts[0];
    setAssistantReply(
      top
        ? `Best match: ${top.name} from ${top.village ?? top.origin ?? 'verified supplier'} at ${formatCurrency(top.price)}/kg. Trust score ${top.qualityScore ?? 90}.`
        : 'No verified supply found for that constraint. Try widening district, price, or certification filters.',
    );
  };

  if (authLoading || !isAuthenticated || user?.role !== 'Startup') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </main>
    );
  }

  return (
    <main
      className={cn(
        'min-h-screen overflow-x-hidden font-sans',
        darkMode
          ? 'bg-[#06120d] text-white'
          : 'bg-[#f3fbf5] text-slate-950',
      )}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.24),transparent_32%),radial-gradient(circle_at_78%_0%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(135deg,#06120d,#0f2418_45%,#eefcf2)]" />

      <header className="sticky top-0 z-40 px-4 py-4 sm:px-6">
        <nav className="mx-auto flex max-w-7xl items-center gap-3 rounded-3xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl shadow-emerald-950/20 backdrop-blur-2xl">
          <button onClick={() => router.push('/startup')} className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Leaf size={20} />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-black tracking-tight">KRISHI-SHETRA</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">Startup Command</span>
            </span>
          </button>

          <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-2 lg:flex">
            <Search size={17} className="text-emerald-200" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Global search across suppliers, orders, villages..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/45"
            />
          </div>

          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 md:max-w-sm">
            <PackageSearch size={17} className="text-emerald-200" />
            <input
              value={marketplaceQuery}
              onChange={(event) => setMarketplaceQuery(event.target.value)}
              placeholder="Marketplace search"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/45"
            />
          </div>

          <button className="relative rounded-2xl border border-white/10 bg-white/10 p-3 transition hover:bg-white/15" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-300" />
          </button>
          <button
            onClick={() => setDarkMode((value) => !value)}
            className="rounded-2xl border border-white/10 bg-white/10 p-3 transition hover:bg-white/15"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 transition hover:bg-white/15"
          >
            <UserRound size={18} />
            <span className="hidden text-sm font-semibold md:inline">{user.name}</span>
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]"
        >
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-100">
                Live procurement OS
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
                {visibleProducts.length} verified listings online
              </span>
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">
              {getHourGreeting()}, {user.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/70">
              Source verified millet supply, compare trusted SHGs and FPOs, assemble bulk RFQs, and track procurement movement from one command center.
            </p>
            <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/20 p-3 sm:flex-row">
              <div className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-white/10 px-4">
                <Bot className="text-emerald-200" size={20} />
                <input
                  value={assistantInput}
                  onChange={(event) => setAssistantInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') runAssistant();
                  }}
                  placeholder="What would you like to source today?"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-white/45"
                />
              </div>
              <button
                onClick={() => runAssistant()}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 text-sm font-black text-emerald-950 transition hover:bg-emerald-300"
              >
                <Sparkles size={18} />
                Ask Copilot
              </button>
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-emerald-950/20 backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-100/70">AI Procurement Assistant</p>
                <h2 className="mt-1 text-xl font-black">Copilot Panel</h2>
              </div>
              <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-[11px] font-black text-emerald-950">Online</span>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-emerald-50/80">
              {assistantReply}
            </div>
            <div className="mt-4 grid gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => runAssistant(prompt)}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left text-xs font-semibold text-white/80 transition hover:border-emerald-300/40 hover:bg-white/15"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.aside>
        </motion.section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Available Marketplace', value: `${visibleProducts.length}`, icon: ShoppingBag, detail: 'approved lots ready' },
            { title: 'Bulk Procurement', value: formatCurrency(procurementTotal), icon: Truck, detail: `${procurement.length} products selected` },
            { title: 'Saved Suppliers', value: `${favorites.length}`, icon: Heart, detail: 'favorites and contacts' },
            { title: 'Orders', value: `${orders.length}`, icon: PackageCheck, detail: 'current procurement records' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="rounded-[1.75rem] border border-white/12 bg-white/10 p-5 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-2xl bg-emerald-300/15 p-3 text-emerald-200">
                  <item.icon size={21} />
                </span>
                <ChevronRight size={18} className="text-white/35" />
              </div>
              <p className="mt-5 text-sm font-semibold text-white/60">{item.title}</p>
              <p className="mt-2 text-3xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-xs text-emerald-100/55">{item.detail}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/60">Section 1</p>
                <h2 className="mt-1 text-2xl font-black">Live Marketplace Feed</h2>
              </div>
              <Activity className="text-emerald-200" />
            </div>
            <div className="space-y-3">
              {loadingData
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-16 animate-pulse rounded-2xl bg-white/10" />
                  ))
                : feed.map((item, index) => (
                    <motion.div
                      key={`${item.title}-${index}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/15 p-4"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100/55">{item.label}</p>
                        <p className="truncate text-sm font-bold text-white">{item.title}</p>
                        <p className="text-xs text-white/50">{item.meta}</p>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </div>

          <div id="marketplace" className="rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-2xl">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/60">Section 3</p>
                <h2 className="mt-1 text-2xl font-black">Marketplace Explorer</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none"
                >
                  {districts.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button
                  onClick={() => setOrganicOnly((value) => !value)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold transition',
                    organicOnly ? 'border-emerald-300 bg-emerald-300 text-emerald-950' : 'border-white/10 bg-black/25 text-white',
                  )}
                >
                  <Filter size={15} />
                  Organic
                </button>
              </div>
            </div>
            <div className="grid max-h-[620px] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
              {visibleProducts.map((product) => (
                <motion.article
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20"
                >
                  <div className="relative aspect-[16/10] bg-emerald-950/30">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = '/foxtail1.jpg';
                      }}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-300 px-3 py-1 text-[11px] font-black text-emerald-950">
                      {product.certifications?.[0] ?? product.badge ?? 'Verified'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-100/55">{product.category}</p>
                        <h3 className="mt-1 text-lg font-black">{product.name}</h3>
                      </div>
                      <p className="text-right text-lg font-black text-emerald-200">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                        <MapPin size={13} />
                        {product.village ?? product.origin ?? 'Regional'}
                      </span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1">{product.quantity ?? 'Ready stock'}</span>
                      <span className="rounded-full bg-white/10 px-2.5 py-1">Grade {product.qualityScore ?? 90}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setSelectedSupplier(suppliers.find((supplier) => supplier.products[0]?.id === product.id) ?? activeSupplier)}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold transition hover:bg-white/15"
                      >
                        Supplier
                      </button>
                      <button
                        onClick={() => addProcurementLine(product)}
                        className="flex-1 rounded-2xl bg-emerald-400 px-3 py-2 text-sm font-black text-emerald-950 transition hover:bg-emerald-300"
                      >
                        Add to RFQ
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div id="suppliers" className="rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/60">Sections 4 and 7</p>
            <h2 className="mt-1 text-2xl font-black">Supplier Details</h2>
            {activeSupplier && (
              <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-300 text-2xl font-black text-emerald-950">
                    {activeSupplier.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-2xl font-black">{activeSupplier.name}</h3>
                    <p className="mt-1 text-sm text-white/55">
                      {activeSupplier.role} - {activeSupplier.village}, {activeSupplier.district}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setFavorites((current) =>
                        current.includes(activeSupplier.id)
                          ? current.filter((id) => id !== activeSupplier.id)
                          : [...current, activeSupplier.id],
                      )
                    }
                    className={cn(
                      'rounded-2xl p-3 transition',
                      favorites.includes(activeSupplier.id) ? 'bg-rose-400 text-rose-950' : 'bg-white/10 text-white',
                    )}
                    aria-label="Favorite supplier"
                  >
                    <Heart size={18} fill={favorites.includes(activeSupplier.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Trust Score', value: `${activeSupplier.trustScore}` },
                    { label: 'Quality', value: `${activeSupplier.rating}` },
                    { label: 'Orders', value: `${activeSupplier.ordersCompleted}` },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/10 p-3">
                      <p className="text-xl font-black">{stat.value}</p>
                      <p className="text-[11px] text-white/45">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-white/70"><Factory size={16} className="text-emerald-200" /> FPO: {activeSupplier.fpo}</p>
                  <p className="flex items-center gap-2 text-white/70"><UsersRound size={16} className="text-emerald-200" /> SHG: {activeSupplier.shg}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeSupplier.certifications.map((cert) => (
                      <span key={cert} className="inline-flex items-center gap-1 rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-100">
                        <ShieldCheck size={13} />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="flex-1 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-emerald-950">Contact Supplier</button>
                  <button onClick={() => addProcurementLine(activeSupplier.products[0])} className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold">
                    Add Product
                  </button>
                </div>
              </div>
            )}
            <div className="mt-4 grid gap-2">
              {suppliers.slice(0, 4).map((supplier) => (
                <button
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                >
                  <span>
                    <span className="block text-sm font-bold">{supplier.name}</span>
                    <span className="text-xs text-white/45">{supplier.role} - {supplier.village}</span>
                  </span>
                  <Star size={16} className="text-amber-300" fill="currentColor" />
                </button>
              ))}
            </div>
          </div>

          <div id="orders" className="rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/60">Sections 5 and 8</p>
            <h2 className="mt-1 text-2xl font-black">Bulk Procurement</h2>
            <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white/55">Procurement cart</p>
                  <p className="text-3xl font-black">{formatCurrency(procurementTotal)}</p>
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-100">{procurementStatus}</span>
              </div>
              <div className="mt-5 space-y-3">
                {procurement.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-white/50">
                    Select products from the Marketplace Explorer to build a bulk RFQ.
                  </div>
                ) : (
                  procurement.map((line) => (
                    <div key={line.product.id} className="grid gap-3 rounded-2xl bg-white/10 p-3 sm:grid-cols-[1fr_120px_100px] sm:items-center">
                      <div>
                        <p className="font-bold">{line.product.name}</p>
                        <p className="text-xs text-white/45">{formatCurrency(line.product.price)}/kg - {line.product.village ?? line.product.origin ?? 'Verified'}</p>
                      </div>
                      <input
                        type="number"
                        min={100}
                        step={100}
                        value={line.quantity}
                        onChange={(event) => updateQuantity(line.product.id, Number(event.target.value))}
                        className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none"
                      />
                      <p className="text-sm font-black text-emerald-100">{formatCurrency(line.quantity * line.product.price)}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setProcurementStatus('Quotation generated')}
                  disabled={!procurement.length}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Generate Quotation
                </button>
                <button
                  onClick={() => setProcurementStatus('Bulk request placed')}
                  disabled={!procurement.length}
                  className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Place Bulk Request
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {['Processing', 'Delivered', 'Cancelled', 'Shipment Tracking'].map((status, index) => (
                <div key={status} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-black">{status === 'Shipment Tracking' ? `${Math.max(1, orders.length)}` : index === 0 ? '3' : index === 1 ? '12' : '0'}</p>
                  <p className="text-sm text-white/50">{status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="analytics" className="mt-6 rounded-[2rem] border border-white/12 bg-white/10 p-5 backdrop-blur-2xl">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-100/60">Section 6</p>
              <h2 className="mt-1 text-2xl font-black">Market Intelligence</h2>
            </div>
            <p className="text-sm text-white/50">AI recommendations generated from current marketplace supply.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black">Price Trends</h3>
                <LineChart className="text-emerald-200" />
              </div>
              <div className="flex h-44 items-end gap-3">
                {[42, 58, 49, 68, 61, 78, 72, 88].map((height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.04 }}
                    className="flex-1 rounded-t-2xl bg-linear-to-t from-emerald-500 to-emerald-200"
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <BarChart3 className="mb-4 text-emerald-200" />
              <p className="text-3xl font-black">{totalSupply.toFixed(1)} MT</p>
              <p className="mt-1 text-sm text-white/50">Supply forecast available</p>
              <p className="mt-5 text-sm text-emerald-100/70">Ragi and Bajra remain strongest for next month.</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
              <CircleDollarSign className="mb-4 text-emerald-200" />
              <p className="text-3xl font-black">18%</p>
              <p className="mt-1 text-sm text-white/50">Demand prediction lift</p>
              <p className="mt-5 text-sm text-emerald-100/70">Apply PMFME support for processing expansion.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {['Popular Crops', 'Most Active Districts', 'Government Scheme Suggestions'].map((title, index) => (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex items-center gap-2">
                  {index === 0 ? <Wheat size={18} className="text-emerald-200" /> : index === 1 ? <MapPin size={18} className="text-emerald-200" /> : <CheckCircle2 size={18} className="text-emerald-200" />}
                  <h3 className="font-black">{title}</h3>
                </div>
                <p className="text-sm leading-6 text-white/55">
                  {index === 0
                    ? 'Ragi, Bajra, Jowar and Foxtail Millet are leading startup procurement demand.'
                    : index === 1
                      ? 'Mandya, Solapur, Kalaburagi and Tumakuru show the highest verified supply activity.'
                      : 'PMFME, ODOP and millet mission incentives match this sourcing basket.'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-3xl border border-white/15 bg-slate-950/70 px-3 py-2 shadow-2xl backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-1">
          {[
            { label: 'Marketplace', icon: ShoppingBag, href: '#marketplace' },
            { label: 'Orders', icon: Truck, href: '#orders' },
            { label: 'Suppliers', icon: UsersRound, href: '#suppliers' },
            { label: 'Analytics', icon: BarChart3, href: '#analytics' },
            { label: 'Profile', icon: UserRound, href: '/me/profile' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.href.startsWith('#')) document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                else router.push(item.href);
              }}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold text-white/55 transition hover:bg-white/10 hover:text-emerald-100"
            >
              <item.icon size={18} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
