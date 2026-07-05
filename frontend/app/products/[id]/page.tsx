'use client';

// app/products/[id]/page.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductDetailClient, { type Product as DetailProduct, type RelatedItem } from '@/components/ProductDetailClient';
import { productsApi, type Product } from '@/lib/api';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-products';

/**
 * Resolves the product for /products/[id] from the backend, falling back to the
 * shared demo catalogue so the page always shows the *actual* product that was
 * clicked (never a hard-coded mock).
 */
export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    (async () => {
      const [found, market] = await Promise.all([
        productsApi.getById(id).catch(() => null),
        productsApi.getAll().catch(() => [] as Product[]),
      ]);

      const pool = market.length ? market : FALLBACK_PRODUCTS;
      const base = found ?? pool.find((p) => p.id === id) ?? FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;

      if (!mounted) return;
      if (!base) {
        setNotFound(true);
        return;
      }

      const related: RelatedItem[] = pool
        .filter((p) => p.id !== base.id)
        .slice(0, 8)
        .map((p) => ({ id: p.id, title: p.name, image: p.imageUrl, price: p.price }));

      setProduct({
        id: base.id,
        name: base.name,
        price: base.price,
        description: base.description,
        imageUrl: base.imageUrl,
        images: base.images?.length ? base.images : base.imageUrl ? [base.imageUrl] : undefined,
        category: base.category,
        origin: base.origin,
        related,
      });
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center">
        <p className="text-lg font-bold text-slate-700">Product not found</p>
        <a href="/products" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
          Back to marketplace
        </a>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
