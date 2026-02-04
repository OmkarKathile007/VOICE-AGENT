// // app/products/[id]/ProductDetailClient.tsx
// "use client";

// import React, { useMemo, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// /** Types exported so server page can import Product type */
// export type RelatedItem = { id: string; title: string; image: string; price?: number };
// export type Product = {
//   id: string;
//   title: string;
//   price: number;
//   description?: string;
//   images: string[]; // prefer 4
//   related?: RelatedItem[];
// };

// type Props = { product: Product };

// /**
//  * Product detail client component:
//  * - Main image + thumbnail selectors (4 small images)
//  * - Add to Cart and Buy Now
//  * - Related products marquee (smooth left movement, pauses on hover)
//  * - Responsive, accessible, Tailwind CSS
//  */
// export default function ProductDetailClient({ product }: Props) {
//   const router = useRouter();
//   const [activeIndex, setActiveIndex] = useState<number>(0);
//   const [qty, setQty] = useState<number>(1);
//   const [adding, setAdding] = useState<boolean>(false);

//   const mainImage = product.images[activeIndex] ?? product.images[0];
//   const related = product.related ?? [];

//   const handleAddToCart = async () => {
//     setAdding(true);
//     // Replace this with real cart logic or context
//     await new Promise((r) => setTimeout(r, 500));
//     setAdding(false);
//     // Example: show toast or redirect to cart
//     alert(`${product.title} (x${qty}) added to cart — demo`);
//   };

//   const handleBuyNow = () => {
//     // Replace with real checkout flow
//     alert(`Proceeding to checkout for ${product.title} (x${qty}) — demo`);
//   };

//   const goBack = () => router.back();

//   const marqueeDuration = useMemo(() => {
//     const base = 20;
//     return `${Math.max(base, related.length * 6)}s`;
//   }, [related.length]);

//   return (
//     <div className="min-h-screen bg-neutral-900 text-slate-100 p-6">
//       <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden">
//         {/* Card */}
//         <div className="bg-gradient-to-b from-gray-900/80 to-gray-800/60 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
//           {/* Left: gallery + details */}
//           <section className="lg:col-span-2 p-6 md:p-8">
//             <button onClick={goBack} className="text-emerald-300 hover:text-emerald-200 mb-4 inline-flex items-center gap-2">
//               ← Back
//             </button>

//             <div className="flex flex-col md:flex-row gap-6">
//               {/* Main image */}
//               <div className="w-full md:w-1/2 flex items-center justify-center">
//                 <div className="relative w-full max-w-2xl aspect-[4/3] rounded-xl overflow-hidden bg-gray-800/40">
//                   <Image
//                     src={mainImage}
//                     alt={`${product.title} image ${activeIndex + 1}`}
//                     fill
//                     sizes="(max-width: 1024px) 100vw, 50vw"
//                     style={{ objectFit: "contain" }}
//                     className="transition-opacity duration-300"
//                     onError={(e) => {
//                       // fallback to placeholder if image missing
//                       const target = e.target as HTMLImageElement;
//                       target.src = `https://placehold.co/800x600/0f172a/ffffff?text=${encodeURIComponent(product.title)}`;
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Right column: meta + thumbnails + actions */}
//               <div className="w-full md:w-1/2 flex flex-col gap-4">
//                 <h1 className="text-2xl md:text-3xl font-semibold text-white">{product.title}</h1>

//                 <div className="text-emerald-300 font-bold text-2xl">₹{product.price.toFixed(2)}</div>

//                 <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>

//                 {/* Thumbnails */}
//                 <div className="mt-2">
//                   <div className="flex items-center gap-3">
//                     {product.images.slice(0, 4).map((src, i) => {
//                       const active = i === activeIndex;
//                       return (
//                         <button
//                           key={i}
//                           onClick={() => setActiveIndex(i)}
//                           aria-label={`Show image ${i + 1}`}
//                           className={`relative w-20 h-20 rounded-md overflow-hidden border-2 focus:outline-none transition-transform ${
//                             active ? "border-emerald-400 shadow-lg scale-105" : "border-transparent hover:border-slate-600"
//                           }`}
//                         >
//                           <Image src={src} alt={`thumb ${i + 1}`} fill style={{ objectFit: "cover" }} />
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Quantity + CTA */}
//                 <div className="mt-4 flex items-center gap-3">
//                   <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-1">
//                     <button
//                       aria-label="Decrease quantity"
//                       onClick={() => setQty((q) => Math.max(1, q - 1))}
//                       className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
//                     >
//                       -
//                     </button>
//                     <div className="px-3 text-sm">{qty}</div>
//                     <button
//                       aria-label="Increase quantity"
//                       onClick={() => setQty((q) => q + 1)}
//                       className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
//                     >
//                       +
//                     </button>
//                   </div>

//                   <button
//                     onClick={handleAddToCart}
//                     disabled={adding}
//                     className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md transition"
//                   >
//                     {adding ? "Adding..." : "Add to cart"}
//                   </button>

//                   <button
//                     onClick={handleBuyNow}
//                     className="px-4 py-3 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-700/40 transition"
//                   >
//                     Buy now
//                   </button>
//                 </div>

//                 <div className="mt-3 text-xs text-slate-400">
//                   <strong className="text-slate-200">Authenticity:</strong> Traceable from farm → FPO. Free pickup for bulk FPO orders.
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Right: product meta + related marquee */}
//           <aside className="p-6 md:p-8 border-l border-gray-700/30">
//             <div className="text-sm text-slate-300 mb-4">Product details</div>

//             <ul className="text-sm text-slate-200 space-y-2">
//               <li>
//                 <strong className="text-slate-100">Product ID:</strong> <span className="text-slate-300 ml-2">{product.id}</span>
//               </li>
//               <li>
//                 <strong className="text-slate-100">Category:</strong> <span className="text-slate-300 ml-2">Millets</span>
//               </li>
//               <li>
//                 <strong className="text-slate-100">Availability:</strong> <span className="text-emerald-300 ml-2">In stock</span>
//               </li>
//               <li>
//                 <strong className="text-slate-100">Seller:</strong> <span className="text-slate-300 ml-2">Verified FPO</span>
//               </li>
//             </ul>

//             <div className="mt-6 mb-3 text-slate-300 font-semibold">Related products</div>

//             {/* marquee */}
//             <div className="relative overflow-hidden rounded-lg">
//               <div
//                 className="flex gap-4 will-change-transform"
//                 style={{
//                   animation: `marquee ${marqueeDuration} linear infinite`,
//                 }}
//               >
//                 {[...related, ...related].map((r, idx) => (
//                   <div
//                     key={`${r.id}-${idx}`}
//                     className="min-w-[160px] max-w-[160px] bg-gray-800/60 rounded-lg p-3 flex-shrink-0 transform hover:-translate-y-2 transition"
//                   >
//                     <div className="relative w-full h-28 rounded-md overflow-hidden bg-gray-700/40">
//                       <Image src={r.image} alt={r.title} fill style={{ objectFit: "cover" }} />
//                     </div>
//                     <div className="mt-2 text-sm text-slate-200 line-clamp-2">{r.title}</div>
//                     {typeof r.price === "number" && <div className="text-emerald-300 font-semibold mt-1">₹{r.price}</div>}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               <button onClick={() => router.push("/collections/millets")} className="text-sm text-emerald-300 underline">
//                 Browse all millets →
//               </button>
//             </div>
//           </aside>
//         </div>
//       </div>

//       {/* Inline marquee keyframes & hover-pause */}
//       <style jsx>{`
//         @keyframes marquee {
//           0% {
//             transform: translateX(0%);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//         /* pause marquee when hovering over the container */
//         .relative:hover .will-change-transform {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </div>
//   );
// }


// "use client";

// import React, { useMemo, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// /** Types exported so server page can import Product type */
// export type RelatedItem = { id: string; title: string; image: string; price?: number };
// export type Product = {
//   id: string;
//   title: string;
//   price: number;
//   description?: string;
//   images: string[];
//   related?: RelatedItem[];
// };

// type Props = { product: Product };

// export default function ProductDetailClient({ product }: Props) {
//   const router = useRouter();
//   const [activeIndex, setActiveIndex] = useState<number>(0);
//   const [qty, setQty] = useState<number>(1);
//   const [adding, setAdding] = useState<boolean>(false);

//   const mainImage = product.images[activeIndex] ?? product.images[0];
//   const related = product.related ?? [];

//   const handleAddToCart = async () => {
//     setAdding(true);
//     await new Promise((r) => setTimeout(r, 500));
//     setAdding(false);
//     alert(`${product.title} (x${qty}) added to cart — demo`);
//   };

//   const handleBuyNow = () => {
//     alert(`Proceeding to checkout for ${product.title} (x${qty}) — demo`);
//   };

//   const goBack = () => router.back();

//   const marqueeDuration = useMemo(() => {
//     const base = 20;
//     return `${Math.max(base, related.length * 6)}s`;
//   }, [related.length]);

//   return (
//     <div className="w-screen h-screen bg-neutral-950 text-slate-100 overflow-y-auto overflow-x-hidden">
//       {/* Top navigation or back button */}
//       <div className="absolute top-4 left-6 z-10">
//         <button
//           onClick={goBack}
//           className="text-emerald-400 hover:text-emerald-300 text-sm md:text-base inline-flex items-center gap-1"
//         >
//           ← Back
//         </button>
//       </div>

//       {/* Main container */}
//       <div className="flex flex-col lg:flex-row items-stretch w-full h-full">
//         {/* LEFT: Image gallery */}
//         <div className="relative w-full lg:w-[60%] h-[50vh] lg:h-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 md:p-8">
//           <div className="relative w-full h-full max-w-5xl">
//             <Image
//               src={mainImage}
//               alt={`${product.title} image`}
//               fill
//               priority
//               className="object-contain rounded-2xl"
//             />
//           </div>

//           {/* Thumbnails overlay at bottom */}
//           <div className="absolute bottom-6 flex gap-3 justify-center w-full">
//             {product.images.slice(0, 4).map((src, i) => {
//               const active = i === activeIndex;
//               return (
//                 <button
//                   key={i}
//                   onClick={() => setActiveIndex(i)}
//                   className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-transform ${
//                     active
//                       ? "border-emerald-400 scale-105 shadow-lg"
//                       : "border-gray-700 hover:border-slate-500"
//                   }`}
//                 >
//                   <Image src={src} alt={`thumb ${i + 1}`} fill className="object-cover" />
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* RIGHT: Details + Actions */}
//         <div className="w-full lg:w-[40%] h-full bg-gradient-to-b from-gray-900 to-gray-800 p-8 flex flex-col justify-between">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
//               {product.title}
//             </h1>
//             <p className="text-emerald-300 font-semibold text-2xl mb-4">
//               ₹{product.price.toFixed(2)}
//             </p>
//             <p className="text-slate-300 text-sm leading-relaxed mb-6">
//               {product.description ??
//                 "Premium organic millets sourced directly from verified FPOs. Nutritious, gluten-free, and sustainably cultivated."}
//             </p>

//             {/* Quantity + Buttons */}
//             <div className="flex flex-wrap items-center gap-4 mb-4">
//               <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-1">
//                 <button
//                   aria-label="Decrease quantity"
//                   onClick={() => setQty((q) => Math.max(1, q - 1))}
//                   className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
//                 >
//                   -
//                 </button>
//                 <div className="px-3 text-sm">{qty}</div>
//                 <button
//                   aria-label="Increase quantity"
//                   onClick={() => setQty((q) => q + 1)}
//                   className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
//                 >
//                   +
//                 </button>
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 disabled={adding}
//                 className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md transition"
//               >
//                 {adding ? "Adding..." : "Add to cart"}
//               </button>

//               <button
//                 onClick={handleBuyNow}
//                 className="px-4 py-3 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-700/40 transition"
//               >
//                 Buy now
//               </button>
//             </div>

//             {/* Product metadata */}
//             <ul className="text-sm text-slate-300 space-y-2 mt-6">
//               <li>
//                 <strong className="text-slate-100">Product ID:</strong>{" "}
//                 <span className="ml-2">{product.id}</span>
//               </li>
//               <li>
//                 <strong className="text-slate-100">Category:</strong>{" "}
//                 <span className="ml-2">Millets</span>
//               </li>
//               <li>
//                 <strong className="text-slate-100">Seller:</strong>{" "}
//                 <span className="ml-2">Verified FPO</span>
//               </li>
//             </ul>
//           </div>

//           {/* RELATED PRODUCTS MARQUEE */}
//           {related.length > 0 && (
//             <div className="mt-10">
//               <h3 className="text-slate-200 mb-3 font-semibold">
//                 Related Products
//               </h3>
//               <div className="relative overflow-hidden rounded-lg border border-gray-700/30">
//                 <div
//                   className="flex gap-4 will-change-transform"
//                   style={{
//                     animation: `marquee ${marqueeDuration} linear infinite`,
//                   }}
//                 >
//                   {[...related, ...related].map((r, idx) => (
//                     <div
//                       key={`${r.id}-${idx}`}
//                       className="min-w-[150px] bg-gray-800/60 rounded-lg p-3 flex-shrink-0 transform hover:-translate-y-2 transition"
//                     >
//                       <div className="relative w-full h-24 rounded-md overflow-hidden bg-gray-700/40">
//                         <Image src={r.image} alt={r.title} fill className="object-cover" />
//                       </div>
//                       <div className="mt-2 text-sm text-slate-200 line-clamp-2">{r.title}</div>
//                       {typeof r.price === "number" && (
//                         <div className="text-emerald-300 font-semibold mt-1">
//                           ₹{r.price}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Inline styles */}
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
// }


"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/** Types exported so server page can import Product type */
export type RelatedItem = { id: string; title: string; image: string; price?: number };
export type Product = {
  id: string;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  related?: RelatedItem[];
};

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [qty, setQty] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);

  /** 🧩 Manually define product images */
  const manualImages = [
    "/foxtail1.jpg",
    "/foxtail2.jpg",
    "/foxtail3.jpg",
    "/foxtail4.jpg",
  ];

  /** 🧩 Manually define related products here */
  const manualRelated: RelatedItem[] = [
    {
      id: "1",
      title: "Little Millet (Kutki)",
      image: "/pearlmillet.jpg",
      price: 120,
    },
    {
      id: "2",
      title: "Kodo Millet (Varagu)",
      image: "/kodo.jpg",
      price: 140,
    },
    {
      id: "3",
      title: "Barnyard Millet (Sanwa)",
      image: "/jowar.jpg",
      price: 110,
    },
    {
      id: "4",
      title: "Proso Millet (Chena)",
      image: "/ragi.jpg",
      price: 130,
    },
  ];

  const mainImage = manualImages[activeIndex];
  const related = manualRelated; // use manual related instead of product.related

  const handleAddToCart = async () => {
    setAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    setAdding(false);
    alert(`${product.title} (x${qty}) added to cart — demo`);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to checkout for ${product.title} (x${qty}) — demo`);
  };

  const goBack = () => router.back();

  const marqueeDuration = useMemo(() => {
    const base = 20;
    return `${Math.max(base, related.length * 6)}s`;
  }, [related.length]);

  return (
    <div className="w-screen h-screen bg-neutral-950 text-slate-100 overflow-y-auto overflow-x-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-6 z-10">
        <button
          onClick={goBack}
          className="text-emerald-400 hover:text-emerald-300 text-sm md:text-base inline-flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row items-stretch w-full h-full">
        {/* LEFT: image gallery */}
        <div className="relative w-full lg:w-[60%] h-[50vh] lg:h-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-full max-w-5xl">
            <Image
              src={mainImage}
              alt={`${product.title} image`}
              fill
              priority
              className="object-contain rounded-2xl"
            />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-6 flex gap-3 justify-center w-full">
            {manualImages.map((src, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-transform ${
                    active
                      ? "border-emerald-400 scale-105 shadow-lg"
                      : "border-gray-700 hover:border-slate-500"
                  }`}
                >
                  <Image src={src} alt={`thumb ${i + 1}`} fill className="object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: details */}
        <div className="w-full lg:w-[40%] h-full bg-gradient-to-b from-gray-900 to-gray-800 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              {product.title}
            </h1>
            <p className="text-emerald-300 font-semibold text-2xl mb-4">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {product.description ??
                "Premium organic millets sourced directly from verified FPOs. Nutritious, gluten-free, and sustainably cultivated."}
            </p>

            {/* Quantity + Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                  -
                </button>
                <div className="px-3 text-sm">{qty}</div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md transition"
              >
                {adding ? "Adding..." : "Add to cart"}
              </button>

              <button
                onClick={handleBuyNow}
                className="px-4 py-3 rounded-lg border border-slate-700 text-slate-100 hover:bg-slate-700/40 transition"
              >
                Buy now
              </button>
            </div>

            {/* Metadata */}
            <ul className="text-sm text-slate-300 space-y-2 mt-6">
              <li>
                <strong className="text-slate-100">Product ID:</strong>{" "}
                <span className="ml-2">{product.id}</span>
              </li>
              <li>
                <strong className="text-slate-100">Category:</strong>{" "}
                <span className="ml-2">Millets</span>
              </li>
              <li>
                <strong className="text-slate-100">Seller:</strong>{" "}
                <span className="ml-2">Verified FPO</span>
              </li>
            </ul>
          </div>

          {/* Related Products Marquee */}
          {related.length > 0 && (
            <div className="mt-10">
              <h3 className="text-slate-200 mb-3 font-semibold">Related Products</h3>
              <div className="relative overflow-hidden rounded-lg border border-gray-700/30">
                <div
                  className="flex gap-4 will-change-transform"
                  style={{
                    animation: `marquee ${marqueeDuration} linear infinite`,
                  }}
                >
                  {[...related, ...related].map((r, idx) => (
                    <div
                      key={`${r.id}-${idx}`}
                      className="min-w-[150px] bg-gray-800/60 rounded-lg p-3 flex-shrink-0 transform hover:-translate-y-2 transition"
                    >
                      <div className="relative w-full h-24 rounded-md overflow-hidden bg-gray-700/40">
                        <Image src={r.image} alt={r.title} fill className="object-cover" />
                      </div>
                      <div className="mt-2 text-sm text-slate-200 line-clamp-2">{r.title}</div>
                      {typeof r.price === "number" && (
                        <div className="text-emerald-300 font-semibold mt-1">
                          ₹{r.price}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .relative:hover .will-change-transform {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

