'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { ShoppingBag, MapPin, Phone, CreditCard, Truck, CheckCircle, ArrowLeft, Trash2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, totalItems, removeFromCart, setQty, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod' as 'cod' | 'upi',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`.trim().replace(/^, /, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (items.length === 0) return;
    if (!form.phone || !form.address || !form.city || !form.pincode) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Place one order per cart item
      await Promise.all(items.map(item =>
        ordersApi.place({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.qty,
          pricePerUnit: item.product.price,
          deliveryAddress: fullAddress,
          phone: form.phone,
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        })
      ));
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed!</h1>
          <p className="text-slate-500 mb-2">
            Thank you{user?.name ? `, ${user.name}` : ''}! Your order has been received.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            {form.paymentMethod === 'cod'
              ? 'Pay cash on delivery. We\'ll contact you at ' + form.phone + '.'
              : 'UPI payment confirmation will be sent to your email.'}
          </p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/products')}
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors">
              Continue Shopping
            </button>
            <button onClick={() => router.push('/')}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-700 mb-2">Your cart is empty</h1>
          <p className="text-slate-400 text-sm mb-6">Add products before checking out.</p>
          <button onClick={() => router.push('/products')}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={() => router.back()} className="text-slate-600 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-900">Checkout</h1>
          <span className="ml-auto text-sm text-slate-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Delivery form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

            {/* Delivery details */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" /> Delivery Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    <Phone className="w-3 h-3 inline mr-1" /> Phone *
                  </label>
                  <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">PIN Code *</label>
                  <input type="text" required maxLength={6} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
                    placeholder="400001"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    <MapPin className="w-3 h-3 inline mr-1" /> Street Address *
                  </label>
                  <input type="text" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="House/Flat No., Street, Area"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">City *</label>
                  <input type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Order Notes</label>
                  <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Delivery instructions (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all" />
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {([['cod', 'Cash on Delivery', 'Pay when your order arrives.'], ['upi', 'UPI / Online', 'Pay via UPI, Net Banking, or Card.']] as const).map(([val, label, desc]) => (
                  <button key={val} type="button" onClick={() => setForm({ ...form, paymentMethod: val })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${form.paymentMethod === val ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className={`text-sm font-bold mb-1 ${form.paymentMethod === val ? 'text-emerald-700' : 'text-slate-800'}`}>{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-extrabold shadow-lg shadow-emerald-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Placing Order...</>
              ) : (
                <><ShoppingBag className="w-5 h-5" /> Place Order · ₹{totalAmount.toFixed(0)}</>
              )}
            </button>
          </form>

          {/* RIGHT — Order summary */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h2 className="text-base font-bold text-slate-900 mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => setQty(item.product.id, item.qty - 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">-</button>
                        <span className="text-xs font-mono text-slate-600">{item.qty}</span>
                        <button onClick={() => setQty(item.product.id, item.qty + 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">₹{(item.product.price * item.qty).toFixed(0)}</p>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 mt-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-medium">{totalAmount >= 999 ? 'Free' : '₹49'}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span>₹{(totalAmount + (totalAmount >= 999 ? 0 : 49)).toFixed(0)}</span>
                </div>
              </div>
              {totalAmount < 999 && (
                <p className="mt-3 text-xs text-emerald-600 font-medium text-center">
                  Add ₹{(999 - totalAmount).toFixed(0)} more for free delivery
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
