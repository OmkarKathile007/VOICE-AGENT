// app/page.tsx

// 'use client';

// import { products } from '@/lib/mock-data';
// import ProductCard from '@/components/ProductCard';
// import { motion } from 'framer-motion';

// // Animation for the grid container
// const gridContainerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1, // Each child fades in 0.1s after the previous
//     },
//   },
// };

// export default function HomePage() {
//   // Filter products by category for different sections
//   const rawMillets = products.filter((p) => p.category === 'Raw Millets');
//   const processedProducts = products.filter((p) => p.category === 'Processed');
//   const agriTech = products.filter((p) => p.category === 'Agri-Tech');

//   return (
//     <div className="container mx-auto px-4 py-12 bg-gray-50">
//       {/* Section 1: Raw Millets (B2B) */}
//       <section>
//         <h2 className="text-3xl font-bold text-gray-900 mb-6">
//           Raw Millets (Farm-to-Buyer)
//         </h2>
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           variants={gridContainerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {rawMillets.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </motion.div>
//       </section>

//       {/* Section 2: Processed Products (B2C) */}
//       <section className="mt-16">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6">
//           Processed & Value-Added Products
//         </h2>
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           variants={gridContainerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {processedProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </motion.div>
//       </section>

//       {/* Section 3: Agri-Tech Tools */}
//       <section className="mt-16">
//         <h2 className="text-3xl font-bold text-gray-900 mb-6">
//           Millet Processing & Agri-Tech
//         </h2>
//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           variants={gridContainerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {agriTech.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </motion.div>
//       </section>
//     </div>
//   );
// }

// app/products/[id]/page.tsx
import React from "react";
import ProductDetailClient from "@/components/ProductDetailClient";

export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  origin: string;
  rating: number;
  reviews: number;
  images: string[];
  related: { id: string; title: string; image: string; price: number; originalPrice?: number }[];
};

async function getProductById(id: string): Promise<Product> {
  // Replace this with your real DB/API call.
  await new Promise((r) => setTimeout(r, 80)); 

  return {
    id,
    title: "Organic Foxtail Millet (Kangni)",
    price: 150,
    originalPrice: 180,
    description: "Premium organic foxtail millet — unpolished, naturally dried, and sourced directly from verified FPOs in Rajasthan. Nutritious, gluten-free, and perfect for traditional and modern recipes. Packed with protein and essential minerals to support a healthy lifestyle.",
    category: "Millets",
    origin: "Rajasthan",
    rating: 4.8,
    reviews: 124,
    images: [
      "/foxtail1.jpg",
      "/foxtail2.jpg", // Ensure these are in your public folder!
      "/foxtail3.jpg",
      "/foxtail4.jpg",
    ],
    related: [
      { id: "p2", title: "Pearl Millet (Bajra)", image: "/pearlmillet.jpg", price: 120 },
      { id: "p3", title: "Sorghum (Jowar) Flour", image: "/jowar.jpg", price: 90, originalPrice: 110 },
      { id: "p4", title: "Organic Ragi (Finger Millet)", image: "/ragi.jpg", price: 130 },
      { id: "p7", title: "Kodo Millet", image: "/kodo.jpg", price: 160, originalPrice: 200 },
    ],
  };
}

// NEXT.JS 15 FIX: params is a Promise, must be awaited!
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <ProductDetailClient product={product} />
    </div>
  );
}