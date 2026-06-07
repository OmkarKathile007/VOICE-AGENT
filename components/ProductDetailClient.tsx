"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product as CartProduct } from "@/context/CartContext";

export type RelatedItem = { id: string; title: string; image: string; price?: number };
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

const MANUAL_RELATED: RelatedItem[] = [
  { id: "1", title: "Pearl Millet (Bajra)", image: "/pearlmillet.jpg", price: 120 },
  { id: "2", title: "Kodo Millet", image: "/kodo.jpg", price: 140 },
  { id: "3", title: "Sorghum (Jowar) Flour", image: "/jowar.jpg", price: 110 },
  { id: "4", title: "Organic Ragi", image: "/ragi.jpg", price: 130 },
];

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();

  const displayName = product.title ?? product.name ?? "Product";
  const images = product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : FALLBACK_IMAGES);
  const related = product.related ?? MANUAL_RELATED;

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

  const marqueeDuration = useMemo(() => `${Math.max(20, related.length * 6)}s`, [related.length]);

  return (
    <div className="w-screen min-h-screen bg-neutral-950 text-slate-100 overflow-y-auto overflow-x-hidden">
      <div className="absolute top-4 left-6 z-10">
        <button onClick={() => router.back()}
          className="text-emerald-400 hover:text-emerald-300 text-sm md:text-base inline-flex items-center gap-1">
          ← Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch w-full min-h-screen">
        {/* LEFT — gallery */}
        <div className="relative w-full lg:w-[60%] h-[50vh] lg:h-auto lg:min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-full max-w-5xl" style={{ minHeight: 300 }}>
            <Image src={images[activeIndex]} alt={`${displayName} image`} fill priority
              className="object-contain rounded-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/800x600/0f172a/ffffff?text=${encodeURIComponent(displayName)}`; }} />
          </div>
          <div className="absolute bottom-6 flex gap-3 justify-center w-full">
            {images.slice(0, 4).map((src, i) => (
              <button key={i} onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-transform ${i === activeIndex ? "border-emerald-400 scale-105 shadow-lg" : "border-gray-700 hover:border-slate-500"}`}>
                <Image src={src} alt={`thumb ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — details */}
        <div className="w-full lg:w-[40%] bg-linear-to-b from-gray-900 to-gray-800 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{displayName}</h1>
            <p className="text-emerald-300 font-semibold text-2xl mb-1">₹{product.price.toFixed(2)}</p>
            {product.origin && (
              <p className="text-slate-400 text-xs mb-4 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {product.origin}
              </p>
            )}
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {product.description ?? "Premium organic produce sourced directly from verified FPOs. Nutritious, gluten-free, and sustainably cultivated."}
            </p>

            {/* Quantity + CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-1 border border-gray-700">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold">-</button>
                <span className="px-3 text-sm font-mono text-white">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold">+</button>
              </div>

              <button onClick={handleAddToCart}
                className={`px-5 py-3 rounded-lg font-semibold shadow-md transition-all ${added ? "bg-green-400 text-black" : isInCart(product.id) ? "bg-emerald-700 text-white" : "bg-emerald-500 hover:bg-emerald-400 text-black"}`}>
                {added ? "Added!" : isInCart(product.id) ? "In Cart" : "Add to Cart"}
              </button>

              <button onClick={handleBuyNow}
                className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md">
                Buy Now
              </button>
            </div>

            <ul className="text-sm text-slate-300 space-y-2 mt-4 border-t border-gray-700/50 pt-4">
              <li><strong className="text-slate-100">Product ID:</strong><span className="ml-2 font-mono text-xs">{product.id}</span></li>
              {product.category && <li><strong className="text-slate-100">Category:</strong><span className="ml-2">{product.category}</span></li>}
              <li><strong className="text-slate-100">Availability:</strong><span className="ml-2 text-emerald-300">In Stock</span></li>
              <li><strong className="text-slate-100">Seller:</strong><span className="ml-2">Verified FPO</span></li>
            </ul>
          </div>

          {/* Related marquee */}
          {related.length > 0 && (
            <div className="mt-8">
              <h3 className="text-slate-200 mb-3 font-semibold text-sm uppercase tracking-wider">Related Products</h3>
              <div className="relative overflow-hidden rounded-lg border border-gray-700/30"
                style={{ "--marquee-duration": marqueeDuration } as React.CSSProperties}>
                <div className="flex gap-4 will-change-transform"
                  style={{ animation: `marquee ${marqueeDuration} linear infinite` }}>
                  {[...related, ...related].map((r, idx) => (
                    <button key={`${r.id}-${idx}`} onClick={() => router.push(`/products/${r.id}`)}
                      className="min-w-[150px] bg-gray-800/60 rounded-lg p-3 shrink-0 hover:-translate-y-2 transition text-left">
                      <div className="relative w-full h-24 rounded-md overflow-hidden bg-gray-700/40">
                        <Image src={r.image} alt={r.title} fill className="object-cover" />
                      </div>
                      <div className="mt-2 text-sm text-slate-200 line-clamp-2">{r.title}</div>
                      {typeof r.price === "number" && <div className="text-emerald-300 font-semibold mt-1">₹{r.price}</div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .relative:hover .will-change-transform { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
