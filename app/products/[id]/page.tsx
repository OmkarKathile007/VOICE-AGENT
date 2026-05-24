


// app/products/[id]/page.tsx
import React from "react";
import ProductDetailClient, { Product } from "@/components/ProductDetailClient";

/**
 * Server page for product details (app router).
 * Fetch product by id (mock implementation here).
 *
 * Put this file at: app/products/[id]/page.tsx
 */

async function getProductById(id: string): Promise<Product> {
  // Replace this with your real DB/API call. This is mocked for demo.
  await new Promise((r) => setTimeout(r, 80)); // simulate tiny latency

  // Mock product data (images should exist in public/images or be remote URLs)
  return {
    id,
    title: "Organic Foxtail Millet",
    price: 150,
    description:
      "Premium organic foxtail millet — unpolished, naturally dried, and sourced directly from verified FPOs. Nutritious, gluten-free, and perfect for traditional and modern recipes.",
    images: [
      "/images/foxtail1.jpg",
      "/images/foxtail2.jpg",
      "/images/foxtail3.jpg",
      "/images/foxtail4.jpg",
    ],
    related: [
      { id: "p2", title: "Pearl Millet (Bajra)", image: "/images/pearlmillet.jpg", price: 120 },
      { id: "p3", title: "Sorghum (Jowar) Flour", image: "/images/jowar.jpg", price: 90 },
      { id: "p4", title: "Organic Ragi (Finger Millet)", image: "/images/ragi.jpg", price: 130 },
      { id: "p7", title: "Kodo Millet", image: "/images/kodo.jpg", price: 160 },
    ],
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  return (
    <div>
      {/* You can wrap this with your site's layout or header/footer */}
      <ProductDetailClient product={product} />
    </div>
  );
}
