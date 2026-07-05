"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product as CartProduct } from "@/context/CartContext";

export type RelatedItem = { id: string; title: string; image?: string; price?: number };
export type Product = {
  id: string;
  title?: string;
  name?: string;
  price: number;
  description?: string;
  imageUrl?: string;
  images?: string[];
  related?: RelatedItem[];
  category?: string;
  origin?: string;
};

type Props = { product: Product };

const FALLBACK_IMAGES = ["/foxtail1.jpg", "/foxtail2.jpg", "/foxtail3.jpg", "/foxtail4.jpg"];

const placeholder = (label: string) =>
  `https://placehold.co/600x600/f1f5f9/0f172a?text=${encodeURIComponent(label.split(" ").slice(0, 2).join(" ") || "Product")}`;

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();

  const displayName = product.title ?? product.name ?? "Product";
  const gallery = (product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : FALLBACK_IMAGES
  ).filter(Boolean);
  const images = gallery.length ? gallery : FALLBACK_IMAGES;
  const related = product.related ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const cartProduct: CartProduct = {
    id: product.id,
    name: displayName,
    price: product.price,
    imageUrl: images[0],
    category: product.category ?? "General",
  };

  const handleAddToCart = () => {
    addToCart(cartProduct, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(cartProduct, qty);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
            Back to marketplace
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* ── Gallery ── */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-50 to-emerald-50/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeIndex]}
                  alt={displayName}
                  className="h-full w-full object-contain mix-blend-multiply p-4"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholder(displayName); }}
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.slice(0, 6).map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      onClick={() => setActiveIndex(i)}
                      className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 bg-white transition-all ${i === activeIndex ? "border-emerald-500 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${displayName} thumbnail ${i + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = placeholder(displayName); }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {product.category && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">{product.category}</span>
              )}
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{displayName}</h1>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">₹{product.price.toFixed(2)}</span>
                <span className="text-sm font-medium text-slate-500">/ kg</span>
              </div>

              {product.origin && (
                <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {product.origin}
                </p>
              )}

              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                {product.description ??
                  "Premium produce sourced directly from verified farmer collectives and SHGs. Nutritious, naturally cultivated, and quality-checked before it reaches your kitchen."}
              </p>

              {/* Quantity + CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-slate-900">−</button>
                  <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-slate-900">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition-all active:scale-[0.98] ${added ? "bg-emerald-500 text-white" : isInCart(product.id) ? "bg-emerald-700 text-white hover:bg-emerald-800" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                >
                  {added ? "Added to cart ✓" : isInCart(product.id) ? "In cart — add more" : "Add to cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
                >
                  Buy now
                </button>
              </div>

              {/* Meta */}
              <dl className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
                <div className="flex gap-2"><dt className="font-semibold text-slate-700">Product ID:</dt><dd className="font-mono text-xs text-slate-500">{product.id}</dd></div>
                {product.category && <div className="flex gap-2"><dt className="font-semibold text-slate-700">Category:</dt><dd className="text-slate-500">{product.category}</dd></div>}
                <div className="flex gap-2"><dt className="font-semibold text-slate-700">Availability:</dt><dd className="font-semibold text-emerald-600">In Stock</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-700">Seller:</dt><dd className="text-slate-500">SHG-verified supplier</dd></div>
              </dl>
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-4 text-lg font-extrabold tracking-tight text-slate-900">Related products</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {related.map((r) => (
                <button
                  key={r.id}
                  onClick={() => router.push(`/products/${r.id}`)}
                  className="group w-44 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 to-emerald-50/50 p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image || placeholder(r.title)}
                      alt={r.title}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).src = placeholder(r.title); }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-bold text-slate-800 group-hover:text-emerald-700">{r.title}</p>
                    {typeof r.price === "number" && <p className="mt-1 text-sm font-extrabold text-slate-900">₹{r.price.toFixed(0)}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
