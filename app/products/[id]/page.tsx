// // app/products/[id]/ProductDetailClient.tsx
// "use client";

// import React, { useMemo, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// export type RelatedItem = { id: string; title: string; image: string; price?: number };
// export type Product = {
//   id: string;
//   title: string;
//   price: number;
//   description?: string;
//   images: string[]; // at least 1, prefer 4
//   related?: RelatedItem[];
// };

// type Props = {
//   product: Product;
// };

// const ProductDetailClient: React.FC<Props> = ({ product }) => {
//   const router = useRouter();
//   const [activeIndex, setActiveIndex] = useState(0);

//   const mainImage = product.images[activeIndex] ?? product.images[0];
//   const related = product.related ?? [];

//   const handleAddToCart = () => {
//     // Replace with real cart logic / context
//     alert(`${product.title} added to cart (demo)`);
//   };

//   const goBackToListing = () => {
//     // navigate back to listing — tweak route as needed
//     router.push("/products");
//   };

//   const marqueeDuration = useMemo(() => {
//     const base = 20;
//     return `${Math.max(base, related.length * 6)}s`;
//   }, [related.length]);

//   return (
//     <div className="min-h-screen bg-gray-900 text-slate-100 p-6">
//       <div className="max-w-6xl mx-auto bg-gray-800/60 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
//         {/* LEFT: Images + details */}
//         <div className="lg:col-span-2 p-6 flex flex-col gap-6">
//           <button
//             onClick={goBackToListing}
//             className="text-sm text-emerald-300 hover:text-emerald-200 underline self-start"
//           >
//             ← Back to products
//           </button>

//           <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/30 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
//             <div className="w-full md:w-1/2 flex items-center justify-center">
//               {/* Main image */}
//               <div className="relative w-full max-w-xl aspect-[4/3] rounded-lg overflow-hidden bg-gray-700/30">
//                 <Image
//                   src={mainImage}
//                   alt={`${product.title} image ${activeIndex + 1}`}
//                   fill
//                   style={{ objectFit: "contain" }}
//                   sizes="(max-width: 1024px) 100vw, 50vw"
//                 />
//               </div>
//             </div>

//             {/* Right column: details */}
//             <div className="w-full md:w-1/2 flex flex-col gap-4">
//               <h1 className="text-2xl md:text-3xl font-semibold text-white">{product.title}</h1>
//               <div className="text-emerald-300 font-bold text-2xl">₹{product.price.toFixed(2)}</div>

//               <p className="text-sm text-slate-300 leading-relaxed">
//                 {product.description ||
//                   "High-quality, farm-sourced millet — traceable and certified. Replace this with your detailed product description."}
//               </p>

//               {/* Thumbnail strip */}
//               <div className="mt-2">
//                 <div className="flex items-center gap-3">
//                   {product.images.slice(0, 4).map((src, i) => {
//                     const active = i === activeIndex;
//                     return (
//                       <button
//                         key={i}
//                         onClick={() => setActiveIndex(i)}
//                         className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
//                           active ? "border-emerald-400 shadow-lg" : "border-transparent hover:border-slate-600"
//                         } focus:outline-none`}
//                         aria-label={`Show image ${i + 1}`}
//                       >
//                         <Image src={src} alt={`${product.title} thumb ${i + 1}`} fill style={{ objectFit: "cover" }} />
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="mt-4 flex items-center gap-3">
//                 <button
//                   onClick={handleAddToCart}
//                   className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md transition"
//                 >
//                   Add to cart
//                 </button>

//                 <button
//                   onClick={() => alert("Buy now (demo)")}
//                   className="px-5 py-3 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-700/40 transition"
//                 >
//                   Buy now
//                 </button>
//               </div>

//               {/* Extra microcopy */}
//               <div className="mt-4 text-xs text-slate-400">
//                 Authenticity & traceability guaranteed • Free pickup for bulk FPO orders • Language support & OTP flows built-in.
//               </div>
//             </div>
//           </div>

//           {/* Thumb images row for mobile (below) */}
//           <div className="md:hidden mt-2 flex gap-3">
//             {product.images.slice(0, 4).map((src, i) => (
//               <button key={i} onClick={() => setActiveIndex(i)} className={`w-20 h-20 rounded-md overflow-hidden ${i === activeIndex ? "ring-2 ring-emerald-400" : ""}`}>
//                 <Image src={src} alt={`thumb ${i + 1}`} fill style={{ objectFit: "cover" }} />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: related + product meta */}
//         <aside className="p-6 border-l border-gray-700/50">
//           <div className="text-sm text-slate-300 mb-4">Product details</div>
//           <ul className="text-sm text-slate-200 space-y-2">
//             <li>
//               <strong className="text-slate-100">ID:</strong> <span className="text-slate-300">{product.id}</span>
//             </li>
//             <li>
//               <strong className="text-slate-100">Category:</strong> <span className="text-slate-300">Millets</span>
//             </li>
//             <li>
//               <strong className="text-slate-100">Availability:</strong> <span className="text-emerald-300">In stock</span>
//             </li>
//             <li>
//               <strong className="text-slate-100">Seller:</strong> <span className="text-slate-300">Local FPO — Verified</span>
//             </li>
//           </ul>

//           {/* Related heading */}
//           <div className="mt-6 mb-3 text-slate-300 font-semibold">Related products</div>

//           {/* Related marquee */}
//           <div className="relative overflow-hidden rounded-lg">
//             <div
//               className="flex gap-4 will-change-transform"
//               style={{
//                 animation: `marquee ${marqueeDuration} linear infinite`,
//               }}
//             >
//               {[...related, ...related].map((r, idx) => (
//                 <div
//                   key={`${r.id}-${idx}`}
//                   className="min-w-[160px] max-w-[160px] bg-gray-800/60 rounded-lg p-3 flex-shrink-0 transform hover:-translate-y-2 transition"
//                 >
//                   <div className="relative w-full h-28 rounded-md overflow-hidden bg-gray-700/40">
//                     <Image src={r.image} alt={r.title} fill style={{ objectFit: "cover" }} />
//                   </div>
//                   <div className="mt-2 text-sm text-slate-200 line-clamp-2">{r.title}</div>
//                   {r.price !== undefined && <div className="text-emerald-300 font-semibold mt-1">₹{r.price}</div>}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6">
//             <button onClick={() => router.push("/collections/millets")} className="text-sm text-emerald-300 underline">
//               Browse all millets →
//             </button>
//           </div>
//         </aside>
//       </div>

//       <style jsx>{`
//         @keyframes marquee {
//           0% {
//             transform: translateX(0%);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//         .relative:hover .will-change-transform {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductDetailClient;



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
