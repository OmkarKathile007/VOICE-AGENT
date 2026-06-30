'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ordersApi, type Order } from '@/lib/api';

// ── Small inline icons ──────────────────────────────────────────────────────────
const Icon = {
  Leaf: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>),
  User: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
  Bag: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>),
  Pin: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>),
  Gear: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>),
  Logout: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>),
  Check: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
  Edit: () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>),
  Wallet: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" /></svg>),
  Heart: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>),
};

const ROLE_LABEL: Record<string, string> = {
  FPO: 'Farmer Producer Org',
  SHG: 'Self-Help Group',
  Startup: 'Startup',
  Processor: 'Processor',
  Consumer: 'Consumer',
};

type Tab = 'overview' | 'orders' | 'addresses' | 'settings';

const NAV: { key: Tab; label: string; icon: () => React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: Icon.User },
  { key: 'orders', label: 'My Orders', icon: Icon.Bag },
  { key: 'addresses', label: 'Addresses', icon: Icon.Pin },
  { key: 'settings', label: 'Account Settings', icon: Icon.Gear },
];

const statusStyles = (status?: string) => {
  const s = (status ?? 'pending').toLowerCase();
  if (s.includes('deliver')) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (s.includes('ship') || s.includes('transit')) return 'bg-sky-50 text-sky-700 ring-sky-200';
  if (s.includes('cancel')) return 'bg-rose-50 text-rose-700 ring-rose-200';
  return 'bg-amber-50 text-amber-700 ring-amber-200';
};

const fmtDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Editable personal info (phone isn't part of auth, persist locally)
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user) setName(user.name ?? '');
    if (typeof window !== 'undefined') setPhone(localStorage.getItem('krishi_profile_phone') ?? '');
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) { setOrdersLoading(false); return; }
    ordersApi.getMyOrders()
      .then(setOrders)
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const initials = useMemo(() => {
    const base = user?.name?.trim() || user?.email?.split('@')[0] || 'U';
    return base.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  }, [user]);

  const totalSpent = useMemo(
    () => orders.reduce((s, o) => s + (o.totalAmount ?? o.pricePerUnit * o.quantity), 0),
    [orders],
  );

  // Derive a default saved address from the latest order, if any
  const addresses = useMemo(() => {
    const latest = orders[0];
    if (latest?.deliveryAddress) {
      return [{ label: 'Home', address: latest.deliveryAddress, phone: latest.phone, isDefault: true }];
    }
    return [];
  }, [orders]);

  const handleLogout = () => { logout(); router.push('/login'); };
  const saveProfile = () => {
    if (typeof window !== 'undefined') localStorage.setItem('krishi_profile_phone', phone);
    setEditing(false);
    showToast('Profile updated successfully');
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  // ── Sign-in gate ───────────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Icon.User />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Sign in to your account</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Access your orders, saved addresses and account settings on Krishi-Shetra.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-6 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          Sign in
        </button>
        <button onClick={() => router.push('/products')} className="mt-3 text-sm font-semibold text-slate-500 hover:text-emerald-600">
          Continue shopping
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Icon.Bag },
    { label: 'Items in Cart', value: totalItems, icon: Icon.Heart },
    { label: 'Saved Addresses', value: addresses.length, icon: Icon.Pin },
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: Icon.Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex cursor-pointer items-center gap-2" onClick={() => router.push('/products')}>
            <div className="rounded-xl bg-emerald-600 p-2 text-white"><Icon.Leaf /></div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight">KrishiShetra</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Farmer Market</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/products')} className="hidden text-sm font-semibold text-slate-600 hover:text-emerald-600 sm:block">
              Continue Shopping
            </button>
            <button onClick={() => router.push('/checkout')} className="relative text-slate-600 hover:text-emerald-600">
              <Icon.Bag />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] font-bold text-white">{totalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-5 text-sm text-slate-400">
          <button onClick={() => router.push('/products')} className="hover:text-emerald-600">Home</button>
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-700">My Account</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {/* Profile summary */}
              <div className="relative bg-linear-to-br from-emerald-600 to-emerald-800 p-5 text-white">
                <div className="absolute right-0 top-0 -translate-y-6 translate-x-6 opacity-10"><div className="scale-[6]"><Icon.Leaf /></div></div>
                <div className="relative flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-extrabold ring-2 ring-white/40 backdrop-blur-sm">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{user.name || 'Krishi-Shetra User'}</p>
                    <p className="truncate text-xs text-emerald-100">{user.email}</p>
                  </div>
                </div>
                <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/25">
                  <span className="text-emerald-200"><Icon.Check /></span>
                  {ROLE_LABEL[user.role] ?? user.role ?? 'Member'} · Verified
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {NAV.map(({ key, label, icon: I }) => {
                  const active = tab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={active ? 'text-emerald-600' : 'text-slate-400'}><I /></span>
                      {label}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <span className="text-rose-500"><Icon.Logout /></span>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* ── Content ── */}
          <section className="min-w-0 space-y-6">
            {tab === 'overview' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><s.icon /></div>
                      <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
                      <p className="text-xs text-slate-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Personal info */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Personal Information</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700">
                        <Icon.Edit /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(false); setName(user.name ?? ''); }} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700">Cancel</button>
                        <button onClick={saveProfile} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">Save</button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Full Name">
                      {editing
                        ? <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                        : <p className="text-sm font-semibold text-slate-800">{user.name || '—'}</p>}
                    </Field>
                    <Field label="Email Address">
                      <p className="text-sm font-semibold text-slate-800">{user.email} <span className="ml-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Verified</span></p>
                    </Field>
                    <Field label="Phone Number">
                      {editing
                        ? <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                        : <p className="text-sm font-semibold text-slate-800">{phone || <span className="text-slate-400">Not added</span>}</p>}
                    </Field>
                    <Field label="Account Type">
                      <p className="text-sm font-semibold text-slate-800">{ROLE_LABEL[user.role] ?? user.role ?? 'Member'}</p>
                    </Field>
                  </div>
                </div>

                {/* Recent orders */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Recent Orders</h2>
                    {orders.length > 0 && (
                      <button onClick={() => setTab('orders')} className="text-sm font-semibold text-emerald-600 hover:underline">View all</button>
                    )}
                  </div>
                  <OrdersList orders={orders.slice(0, 3)} loading={ordersLoading} onShop={() => router.push('/products')} />
                </div>
              </>
            )}

            {tab === 'orders' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-bold">My Orders</h2>
                <OrdersList orders={orders} loading={ordersLoading} onShop={() => router.push('/products')} />
              </div>
            )}

            {tab === 'addresses' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Saved Addresses</h2>
                  <button onClick={() => showToast('Address form coming soon')} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-emerald-700">+ Add New</button>
                </div>
                {addresses.length === 0 ? (
                  <EmptyState title="No saved addresses" sub="Your delivery addresses will appear here after your first order." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {addresses.map((a, i) => (
                      <div key={i} className="relative rounded-xl border border-slate-200 p-4">
                        {a.isDefault && <span className="absolute right-3 top-3 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">DEFAULT</span>}
                        <div className="mb-1 flex items-center gap-2 font-bold text-slate-800"><span className="text-emerald-600"><Icon.Pin /></span>{a.label}</div>
                        <p className="text-sm leading-relaxed text-slate-600">{a.address}</p>
                        {a.phone && <p className="mt-1 text-sm text-slate-500">📞 {a.phone}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'settings' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <h2 className="mb-4 text-lg font-bold">Preferences</h2>
                  <div className="divide-y divide-slate-100">
                    <Toggle label="Order updates" sub="SMS & email about your orders" defaultOn />
                    <Toggle label="Promotions & offers" sub="Deals from verified farmers" defaultOn />
                    <Toggle label="Price drop alerts" sub="When wishlist items get cheaper" />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <h2 className="mb-1 text-lg font-bold">Account</h2>
                  <p className="mb-4 text-sm text-slate-500">Manage your security and account access.</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => showToast('Password reset link sent')} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700">Change Password</button>
                    <button onClick={handleLogout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">Logout</button>
                    <button onClick={() => showToast('Contact support to delete your account')} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg">
          <span className="text-emerald-400"><Icon.Check /></span>{toast}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {children}
    </div>
  );
}

function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Icon.Bag /></div>
      <p className="mt-4 font-bold text-slate-800">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function OrdersList({ orders, loading, onShop }: { orders: Order[]; loading: boolean; onShop: () => void }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Icon.Bag /></div>
        <p className="mt-4 font-bold text-slate-800">No orders yet</p>
        <p className="mt-1 max-w-xs text-sm text-slate-500">When you place an order, it will show up here.</p>
        <button onClick={onShop} className="mt-5 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Start Shopping</button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {orders.map((o, i) => (
        <div key={o.id ?? i} className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-emerald-200">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Icon.Bag /></div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-800">{o.productName || o.cropName || 'Order'}</p>
            <p className="text-xs text-slate-500">
              Qty {o.quantity} · {fmtDate(o.createdAt)}
              {o.id ? ` · #${String(o.id).slice(-6).toUpperCase()}` : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-slate-900">₹{(o.totalAmount ?? o.pricePerUnit * o.quantity).toLocaleString('en-IN')}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusStyles(o.status)}`}>
              {o.status || 'Pending'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Toggle({ label, sub, defaultOn = false }: { label: string; sub: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-emerald-600' : 'bg-slate-300'}`}
        aria-pressed={on}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
