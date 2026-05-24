// 'use client';

// import React, { useState, useMemo } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// // --- ICONS ---
// // We'll use lucide-react for icons.
// // In a real Next.js app, you would install it: npm install lucide-react
// // For this single-file example, I'll use simple SVG paths as components.

// const Search: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//   </svg>
// );

// const ShoppingCart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <circle cx="9" cy="21" r="1" />
//     <circle cx="20" cy="21" r="1" />
//     <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//   </svg>
// );

// const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// // --- TYPES ---

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   category: string;
// };

// type Category = string;

// // --- MOCK DATA ---
// // Mock data for KrishiShetr products
// const allProducts: Product[] = [
//   {
//     id: 'p1',
//     name: 'Organic Foxtail Millet',
//     price: 150.0,
//     category: 'Millets',
//     imageUrl: '/foxtail1.jpg',
//   },
//   {
//     id: 'p2',
//     name: 'Pearl Millet (Bajra)',
//     price: 120.0,
//     category: 'Millets',
//     imageUrl: '/pearlmillet.jpg',
//   },
//   {
//     id: 'p3',
//     name: 'Sorghum (Jowar) Flour',
//     price: 90.0,
//     category: 'Flours',
//     imageUrl: '/jowar.jpg',
//   },
//   {
//     id: 'p4',
//     name: 'Cold-Pressed Coconut Oil',
//     price: 350.0,
//     category: 'Oils',
//     imageUrl: '/coconutoil.jpg',
//   },
//   {
//     id: 'p5',
//     name: 'Natural Forest Honey',
//     price: 450.0,
//     category: 'Honey',
//     imageUrl: '/honey.jpg',
//   },
//   {
//     id: 'p6',
//     name: 'Organic Ragi (Finger Millet)',
//     price: 130.0,
//     category: 'Millets',
//     imageUrl: '/ragi.jpg',
//   },
//   {
//     id: 'p7',
//     name: 'Kodo Millet',
//     price: 160.0,
//     category: 'Millets',
//     imageUrl: '/kodo.jpg',
//   },
//   {
//     id: 'p8',
//     name: 'Groundnut Oil (Cold-Pressed)',
//     price: 400.0,
//     category: 'Oils',
//     imageUrl: '/groundnut.jpg',
//   },
// ];

// const categories: Category[] = [
//   'All Products',
//   'Millets',
//   'Flours',
//   'Oils',
//   'Honey',
//   'Spices',
// ];

// const sortOptions = [
//   'Relevance',
//   'Trending',
//   'Latest arrivals',
//   'Price: Low to high',
//   'Price: High to low',
// ];

// // --- HELPER COMPONENTS ---

// // Product Card Component
// interface ProductCardProps {
//   product: Product;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const router = useRouter();
//   const handleProductClick = () => {
//     // In a real Next.js app, you would use router.push() or <Link>
//      router.push(`/products/${product.id}`)
//     console.log(`Redirecting to product: ${product.name} (ID: ${product.id})`);
//     // Using a custom modal or toast is better than alert() in a real app
//     // For this demo, alert() is used for simplicity.
//     // A better approach would be a state-managed modal.
//   };

//   return (
//     <a
//       href={`#product-${product.id}`} // Use a hash link for single-page demo
//       onClick={(e) => {
//         e.preventDefault(); // Prevent hash link jump
//         handleProductClick();
//       }}
//       className="group"
//     >
//       {/* FIX 1: 
//         - Replaced `aspect-w-1 aspect-h-1` with `aspect-square` (modern Tailwind for 1:1 ratio).
//         - Changed `bg-neutral-800` to `bg-neutral-900` to contrast with the page background.
//       */}
//       <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
//         {/*
//           FIX 2:
//           - Changed `object-cover` (crops image) to `object-contain` (fits image).
//           - Removed `group-hover:scale-105` as it looks odd with `object-contain`.
//         */}
//         <img
//           src={product.imageUrl}
//           alt={product.name}
//           className="h-full w-full object-contain object-center transition-all duration-300 ease-in-out"
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = `https://placehold.co/400x400/374151/FFFFFF?text=${encodeURIComponent(product.name)}`;
//           }}
//         />
//       </div>
//       <h3 className="mt-4 text-sm text-gray-300">{product.name}</h3>
//       <p className="mt-1 text-lg font-medium text-white">
//         ₹{product.price.toFixed(2)}
//       </p>
//     </a>
//   );
// };

// // Sidebar Collection Link
// interface CollectionLinkProps {
//   name: string;
//   isActive: boolean;
//   onClick: () => void;
// }

// const CollectionLink: React.FC<CollectionLinkProps> = ({ name, isActive, onClick }) => {
//   return (
//     <a
//       href="#"
//       onClick={(e) => {
//         e.preventDefault();
//         onClick();
//       }}
//       className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//         isActive
//           ? 'bg-emerald-700 text-white'
//           : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//       }`}
//     >
//       {name}
//     </a>
//   );
// };


// // --- MAIN APP COMPONENT ---

// const ProdDisplay: React.FC = () => {
//   const [selectedCollection, setSelectedCollection] = useState<Category>('All Products');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState(sortOptions[0]);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Memoized filtering logic
//   const filteredProducts = useMemo(() => {
//     let products = [...allProducts]; // Create a new array to sort

//     // Filter by collection
//     if (selectedCollection !== 'All Products') {
//       products = products.filter(p => p.category === selectedCollection);
//     }

//     // Filter by search term
//     if (searchTerm) {
//       products = products.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Sort products
//     switch (sortOrder) {
//       case 'Price: Low to high':
//         products.sort((a, b) => a.price - b.price);
//         break;
//       case 'Price: High to low':
//         products.sort((a, b) => b.price - a.price);
//         break;
//       // Add other sort logic (e.g., 'Trending') if data supports it
//       default:
//         // Default to relevance (original order)
//         break;
//     }

//     return products;
//   }, [selectedCollection, searchTerm, sortOrder]);

//   const handleCollectionClick = (category: Category) => {
//     setSelectedCollection(category);
//     // In a real app, you might update the URL query params here
//     // e.g., router.push(`/?collection=${category}`)
//     console.log(`Navigating to collection: ${category}`);
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Search is already real-time, but this could trigger a formal search API call
//     console.log(`Searching for: ${searchTerm}`);
//   };

//   return (
//     <div className="min-h-screen bg-neutral-800 font-sans text-white">
//       {/* --- Header --- */}
//       <header className="sticky top-0 z-10 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
//         <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between">
            
//             {/* Logo and Desktop Nav */}
//             <div className="flex items-center space-x-8">
//               <a href="#" className="flex-shrink-0">
//                 <span className="text-2xl font-bold text-emerald-500">
//                   KrishiShetra
//                 </span>
//               </a>
              
//             </div>

//             {/* Search Bar */}
//             <div className="flex-1 px-4 md:px-12">
//               <form onSubmit={handleSearch} className="relative w-full">
//                 <input
//                   type="search"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search for millet, oils, honey..."
//                   className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                 />
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <Search className="h-5 w-5 text-gray-500" />
//                 </div>
//               </form>
//             </div>

//             {/* Cart and Mobile Menu Button */}
//             <div className="flex items-center">
//               <button
//                 type="button"
//                 className="rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
//               >
//                 <span className="sr-only">View cart</span>
//                 <ShoppingCart className="h-6 w-6" />
//               </button>
              
//               {/* Mobile menu button */}
//               <button
//                 type="button"
//                 className="ml-4 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white md:hidden"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 <span className="sr-only">Open main menu</span>
//                 {isMobileMenuOpen ? (
//                   <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 ) : (
//                   <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </nav>
        
//         {/* Mobile menu, show/hide based on menu state. */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden" id="mobile-menu">
//             <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
//               <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">All</a>
//               <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Millets</a>
//               <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Oils</a>
//             </div>
//             {/* Mobile Collections */}
//             <div className="border-t border-gray-700 pt-4 pb-3">
//                 <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Collections</h3>
//                 <div className="mt-3 space-y-1 px-2">
//                     {categories.map((category) => (
//                       <CollectionLink
//                         key={category}
//                         name={category}
//                         isActive={selectedCollection === category}
//                         onClick={() => {
//                           handleCollectionClick(category);
//                           setIsMobileMenuOpen(false);
//                         }}
//                       />
//                     ))}
//                 </div>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* --- Main Content --- */}
//       <main>
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row">
            
//             {/* Sidebar (Collections) */}
//             <aside className="hidden w-full py-6 pr-8 md:block md:w-64">
//               <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
//                 Collections
//               </h2>
//               <nav className="mt-4 space-y-1">
//                 {categories.map((category) => (
//                   <CollectionLink
//                     key={category}
//                     name={category}
//                     isActive={selectedCollection === category}
//                     onClick={() => handleCollectionClick(category)}
//                   />
//                 ))}
//               </nav>
//             </aside>

//             {/* Product Grid Area */}
//             <div className="flex-1 py-6">
              
//               {/* Sort By Dropdown */}
//               <div className="mb-6 flex items-baseline justify-between">
//                 <h1 className="text-3xl font-bold tracking-tight text-white">
//                   {selectedCollection}
//                 </h1>

//                 <div className="relative">
//                   <select
//                     value={sortOrder}
//                     onChange={(e) => setSortOrder(e.target.value)}
//                     className="appearance-none rounded-md border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-sm font-medium text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   >
//                     {sortOptions.map((option) => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
//                     <ChevronDown className="h-4 w-4" />
//                   </div>
//                 </div>
//               </div>

//               {/* Product Grid */}
//               {filteredProducts.length > 0 ? (
//                 <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
//                   {filteredProducts.map((product) => (
//                     <ProductCard  key={product.id} product={product} />
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex h-64 items-center justify-center">
//                   <p className="text-xl text-gray-500">No products found.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
      
//       {/* --- Footer --- */}
     
//     </div>
//   );
// };

// export default ProdDisplay;

// // "use client";

// // import React from "react";
// // import Navbar from "@/components/Navbar";
// // import Footer from "@/components/Footer";
// // import Shop from "@/components/Shop";
// // import ShopCategory from "@/components/ShopCategory";
// // import Product from "@/components/Product";
// // import Cart from "@/components/CartItems";
// // // import LoginSignUp from "@/components/LoginSignUp";

// // import men_banner from "@/components/Assets/banner_mens.png";
// // import women_banner from "@/components/Assets/banner_women.png";
// // import kid_banner from "@/components/Assets/banner_kids.png";

// // export default function Page() {
// //   return (
// //     <div className="min-h-screen flex flex-col bg-white text-gray-900">
// //       <Navbar />

// //       {/* Example main content area (home/shop page) */}
// //       <main className="flex-1">
// //         {/* By default, render the Shop page here */}
// //         <Shop />

// //         {/* You can swap the below for category pages as needed */}
// //         <ShopCategory banner={men_banner} category="men" /> 
// //          <ShopCategory banner={women_banner} category="women" />
// //       <ShopCategory banner={kid_banner} category="kid" /> 
// //         <Product />
// //         <Cart /> 
// //         {/* <LoginSignUp /> */}
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // }


// 'use client';

// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';

// // ── Icons ──────────────────────────────────────────────────────────────────────

// const Search: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
//     fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
//   </svg>
// );

// const CartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
//     fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
//     <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
//   </svg>
// );

// const LeafIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
//     <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
//   </svg>
// );

// const SunIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="5" />
//     <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
//     <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
//     <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
//     <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//   </svg>
// );

// const DropIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
//   </svg>
// );

// // ── Types ───────────────────────────────────────────────────────────────────────

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string;
//   category: string;
//   origin?: string;
//   badge?: string;
// };

// type Category = string;

// // ── Mock Data ───────────────────────────────────────────────────────────────────

// const allProducts: Product[] = [
//   { id: 'p1', name: 'Organic Foxtail Millet', price: 150.0, category: 'Millets', imageUrl: '/foxtail1.jpg', origin: 'Rajasthan', badge: 'FPO Certified' },
//   { id: 'p2', name: 'Pearl Millet (Bajra)', price: 120.0, category: 'Millets', imageUrl: '/pearlmillet.jpg', origin: 'Gujarat', badge: 'Direct Farm' },
//   { id: 'p3', name: 'Sorghum (Jowar) Flour', price: 90.0, category: 'Flours', imageUrl: '/jowar.jpg', origin: 'Maharashtra', badge: 'Stone Ground' },
//   { id: 'p4', name: 'Cold-Pressed Coconut Oil', price: 350.0, category: 'Oils', imageUrl: '/coconutoil.jpg', origin: 'Kerala', badge: 'Cold Pressed' },
//   { id: 'p5', name: 'Natural Forest Honey', price: 450.0, category: 'Honey', imageUrl: '/honey.jpg', origin: 'Uttarakhand', badge: 'Wild Harvest' },
//   { id: 'p6', name: 'Organic Ragi (Finger Millet)', price: 130.0, category: 'Millets', imageUrl: '/ragi.jpg', origin: 'Karnataka', badge: 'Organic' },
//   { id: 'p7', name: 'Kodo Millet', price: 160.0, category: 'Millets', imageUrl: '/kodo.jpg', origin: 'Madhya Pradesh', badge: 'Heirloom' },
//   { id: 'p8', name: 'Groundnut Oil (Cold-Pressed)', price: 400.0, category: 'Oils', imageUrl: '/groundnut.jpg', origin: 'Andhra Pradesh', badge: 'Cold Pressed' },
// ];

// const categories: Category[] = ['All Products', 'Millets', 'Flours', 'Oils', 'Honey', 'Spices'];

// const sortOptions = [
//   'Relevance', 'Trending', 'Latest arrivals', 'Price: Low to high', 'Price: High to low',
// ];

// // ── Ambient particle background ─────────────────────────────────────────────────

// const ParticleCanvas: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const particles = Array.from({ length: 55 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 1.6 + 0.3,
//       speedY: -(Math.random() * 0.35 + 0.08),
//       speedX: (Math.random() - 0.5) * 0.2,
//       opacity: Math.random() * 0.45 + 0.08,
//     }));

//     let animId: number;
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       for (const p of particles) {
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(134, 239, 172, ${p.opacity})`;
//         ctx.fill();
//         p.y += p.speedY;
//         p.x += p.speedX;
//         if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
//       }
//       animId = requestAnimationFrame(draw);
//     };
//     draw();

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     window.addEventListener('resize', handleResize);
//     return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize); };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6 }}
//     />
//   );
// };

// // ── Animated stat ticker ─────────────────────────────────────────────────────────

// const StatTicker: React.FC = () => {
//   const stats = [
//     { label: 'Farmers Connected', value: '12,400+', icon: <LeafIcon /> },
//     { label: 'States Sourced', value: '18', icon: <SunIcon /> },
//     { label: 'Varieties Listed', value: '340+', icon: <DropIcon /> },
//   ];
//   return (
//     <div style={{
//       display: 'flex', gap: '0', borderBottom: '1px solid rgba(134,239,172,0.15)',
//       background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
//     }}>
//       {stats.map((s, i) => (
//         <div key={i} style={{
//           flex: 1, display: 'flex', alignItems: 'center', gap: 8,
//           padding: '8px 24px', borderRight: i < stats.length - 1 ? '1px solid rgba(134,239,172,0.12)' : 'none',
//         }}>
//           <span style={{ color: 'rgba(134,239,172,0.7)', flexShrink: 0 }}>{s.icon}</span>
//           <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</span>
//           <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#86efac', fontWeight: 700, marginLeft: 'auto' }}>{s.value}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ── Product Card ─────────────────────────────────────────────────────────────────

// interface ProductCardProps { product: Product; index: number; }

// const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
//   const router = useRouter();
//   const [hovered, setHovered] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setMounted(true), index * 80);
//     return () => clearTimeout(t);
//   }, [index]);

//   const handleClick = () => router.push(`/products/${product.id}`);

//   return (
//     <div
//       onClick={handleClick}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         position: 'relative', cursor: 'pointer', borderRadius: 16,
//         border: hovered ? '1px solid rgba(134,239,172,0.5)' : '1px solid rgba(255,255,255,0.06)',
//         background: hovered
//           ? 'linear-gradient(145deg, rgba(20,30,20,0.95), rgba(10,24,16,0.98))'
//           : 'linear-gradient(145deg, rgba(15,20,15,0.9), rgba(8,16,10,0.95))',
//         overflow: 'hidden', transition: 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
//         transform: mounted ? (hovered ? 'translateY(-6px) scale(1.015)' : 'translateY(0) scale(1)') : 'translateY(24px) scale(0.97)',
//         opacity: mounted ? 1 : 0,
//         boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(134,239,172,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 4px 20px rgba(0,0,0,0.3)',
//       }}
//     >
//       {/* Glow effect on hover */}
//       <div style={{
//         position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none',
//         background: hovered ? 'radial-gradient(ellipse at 50% 0%, rgba(134,239,172,0.07) 0%, transparent 70%)' : 'none',
//         transition: 'opacity 0.3s',
//       }} />

//       {/* Badge */}
//       {product.badge && (
//         <div style={{
//           position: 'absolute', top: 12, left: 12, zIndex: 2,
//           background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
//           border: '1px solid rgba(134,239,172,0.3)',
//           borderRadius: 20, padding: '3px 10px',
//           fontFamily: "'Space Mono', monospace", fontSize: 9,
//           color: '#86efac', letterSpacing: '0.1em', textTransform: 'uppercase',
//         }}>{product.badge}</div>
//       )}

//       {/* Image area */}
//       <div style={{
//         aspectRatio: '1/1', overflow: 'hidden', position: 'relative',
//         background: 'linear-gradient(180deg, rgba(20,35,20,0.8) 0%, rgba(8,16,10,0.6) 100%)',
//       }}>
//         <img
//           src={product.imageUrl}
//           alt={product.name}
//           style={{
//             width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center',
//             transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
//             transform: hovered ? 'scale(1.08)' : 'scale(1)',
//             padding: 16, boxSizing: 'border-box',
//           }}
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = `https://placehold.co/400x400/0d1f0f/86efac?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join('+'))}`;
//           }}
//         />
//         {/* Scan-line overlay */}
//         <div style={{
//           position: 'absolute', inset: 0, pointerEvents: 'none', opacity: hovered ? 0.4 : 0.15,
//           background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(134,239,172,0.03) 3px, rgba(134,239,172,0.03) 4px)',
//           transition: 'opacity 0.3s',
//         }} />
//       </div>

//       {/* Info */}
//       <div style={{ padding: '14px 16px 16px' }}>
//         {/* Origin tag */}
//         {product.origin && (
//           <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
//             <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#86efac', opacity: 0.7 }} />
//             <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: 'rgba(134,239,172,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
//               {product.origin}
//             </span>
//           </div>
//         )}
//         <h3 style={{
//           fontFamily: "'Instrument Serif', serif", fontSize: 16, fontWeight: 400,
//           color: hovered ? '#f0fdf4' : 'rgba(240,253,244,0.85)',
//           lineHeight: 1.3, margin: '0 0 10px', transition: 'color 0.2s',
//           letterSpacing: '-0.01em',
//         }}>{product.name}</h3>

//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div>
//             <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(134,239,172,0.45)', letterSpacing: '0.08em' }}>₹</span>
//             <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700, color: '#86efac', letterSpacing: '-0.02em' }}>
//               {product.price.toFixed(0)}
//             </span>
//             <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(134,239,172,0.4)', marginLeft: 2 }}>/kg</span>
//           </div>

//           <div style={{
//             width: 34, height: 34, borderRadius: '50%',
//             border: '1px solid rgba(134,239,172,0.3)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             background: hovered ? 'rgba(134,239,172,0.12)' : 'transparent',
//             transition: 'all 0.25s', color: hovered ? '#86efac' : 'rgba(134,239,172,0.4)',
//           }}>
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Bottom accent line */}
//       <div style={{
//         position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
//         background: 'linear-gradient(90deg, transparent, rgba(134,239,172,0.5), transparent)',
//         opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
//       }} />
//     </div>
//   );
// };

// // ── Category Pill ────────────────────────────────────────────────────────────────

// interface CategoryPillProps { name: string; isActive: boolean; onClick: () => void; count?: number; }

// const CategoryPill: React.FC<CategoryPillProps> = ({ name, isActive, onClick, count }) => (
//   <button
//     onClick={onClick}
//     style={{
//       display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
//       padding: '8px 16px', borderRadius: 100, border: 'none', outline: 'none',
//       background: isActive
//         ? 'linear-gradient(135deg, rgba(134,239,172,0.2), rgba(74,222,128,0.15))'
//         : 'rgba(255,255,255,0.04)',
//       border: isActive ? '1px solid rgba(134,239,172,0.4)' : '1px solid rgba(255,255,255,0.07)',
//       color: isActive ? '#86efac' : 'rgba(255,255,255,0.5)',
//       fontFamily: "'Space Mono', monospace",
//       fontSize: 11, letterSpacing: '0.05em',
//       transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
//       transform: isActive ? 'scale(1.02)' : 'scale(1)',
//       backdropFilter: 'blur(8px)',
//       whiteSpace: 'nowrap',
//     }}
//   >
//     {isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#86efac' }} />}
//     {name}
//     {count !== undefined && (
//       <span style={{ fontSize: 9, opacity: 0.6, fontFamily: "'Space Mono', monospace" }}>{count}</span>
//     )}
//   </button>
// );

// // ── Main Component ───────────────────────────────────────────────────────────────

// const ProdDisplay: React.FC = () => {
//   const [selectedCollection, setSelectedCollection] = useState<Category>('All Products');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState(sortOptions[0]);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [searchFocused, setSearchFocused] = useState(false);
//   const [pageLoaded, setPageLoaded] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setPageLoaded(true), 100);
//     return () => clearTimeout(t);
//   }, []);

//   const filteredProducts = useMemo(() => {
//     let products = [...allProducts];
//     if (selectedCollection !== 'All Products') {
//       products = products.filter(p => p.category === selectedCollection);
//     }
//     if (searchTerm) {
//       products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
//     }
//     switch (sortOrder) {
//       case 'Price: Low to high': products.sort((a, b) => a.price - b.price); break;
//       case 'Price: High to low': products.sort((a, b) => b.price - a.price); break;
//     }
//     return products;
//   }, [selectedCollection, searchTerm, sortOrder]);

//   const categoryCounts = useMemo(() => {
//     const map: Record<string, number> = { 'All Products': allProducts.length };
//     for (const p of allProducts) map[p.category] = (map[p.category] || 0) + 1;
//     return map;
//   }, []);

//   return (
//     <>
//       {/* Load Google Fonts */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         :root { color-scheme: dark; }
//         body { overflow-x: hidden; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(134,239,172,0.2); border-radius: 2px; }
//         ::placeholder { color: rgba(255,255,255,0.2) !important; }
//         select option { background: #0a1a0e; color: #e2e8f0; }
//       `}</style>

//       <div style={{
//         minHeight: '100vh',
//         background: 'radial-gradient(ellipse at 20% 0%, rgba(6,48,20,0.9) 0%, #060d08 50%, #030608 100%)',
//         fontFamily: "'Space Mono', monospace", color: '#e2e8f0', position: 'relative',
//         overflowX: 'hidden',
//       }}>
//         <ParticleCanvas />

//         {/* Noise texture overlay */}
//         <div style={{
//           position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.025,
//           backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
//         }} />

//         <div style={{ position: 'relative', zIndex: 2 }}>
//           {/* Stat Ticker */}
//           <StatTicker />

//           {/* ── Header ── */}
//           <header style={{
//             position: 'sticky', top: 0, zIndex: 50,
//             borderBottom: '1px solid rgba(134,239,172,0.08)',
//             background: 'rgba(6,13,8,0.85)', backdropFilter: 'blur(20px)',
//           }}>
//             <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
//               <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>

//                 {/* Logo */}
//                 <a href="#" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <div style={{
//                     width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(134,239,172,0.4)',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     background: 'rgba(134,239,172,0.08)',
//                   }}>
//                     <LeafIcon />
//                   </div>
//                   <div>
//                     <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontWeight: 400, color: '#86efac', letterSpacing: '-0.02em' }}>
//                       Krishi
//                     </span>
//                     <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: 'italic', color: 'rgba(134,239,172,0.6)', letterSpacing: '-0.02em' }}>
//                       Shetra
//                     </span>
//                   </div>
//                 </a>

//                 {/* Search */}
//                 <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
//                   <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: searchFocused ? 'rgba(134,239,172,0.7)' : 'rgba(255,255,255,0.2)', transition: 'color 0.2s', pointerEvents: 'none' }}>
//                     <Search />
//                   </div>
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onFocus={() => setSearchFocused(true)}
//                     onBlur={() => setSearchFocused(false)}
//                     placeholder="Search millets, oils, honey..."
//                     style={{
//                       width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
//                       background: searchFocused ? 'rgba(134,239,172,0.05)' : 'rgba(255,255,255,0.03)',
//                       border: searchFocused ? '1px solid rgba(134,239,172,0.35)' : '1px solid rgba(255,255,255,0.08)',
//                       borderRadius: 12, color: '#e2e8f0', fontSize: 13,
//                       fontFamily: "'Space Mono', monospace",
//                       outline: 'none', transition: 'all 0.2s',
//                     }}
//                   />
//                   {searchTerm && (
//                     <button
//                       onClick={() => setSearchTerm('')}
//                       style={{
//                         position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
//                         background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
//                         cursor: 'pointer', fontSize: 14, padding: 2,
//                       }}
//                     >✕</button>
//                   )}
//                 </div>

//                 {/* Right actions */}
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
//                   <button style={{
//                     position: 'relative', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
//                     borderRadius: 12, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.2s',
//                   }}>
//                     <CartIcon />
//                     <div style={{
//                       position: 'absolute', top: 8, right: 8, width: 7, height: 7,
//                       background: '#86efac', borderRadius: '50%',
//                       boxShadow: '0 0 6px rgba(134,239,172,0.8)',
//                     }} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* ── Hero Banner ── */}
//           <div style={{
//             maxWidth: 1280, margin: '0 auto', padding: '40px 24px 32px',
//             opacity: pageLoaded ? 1 : 0, transform: pageLoaded ? 'translateY(0)' : 'translateY(16px)',
//             transition: 'all 0.6s cubic-bezier(0.23,1,0.32,1)',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
//               <div>
//                 <div style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
//                   background: 'rgba(134,239,172,0.08)', border: '1px solid rgba(134,239,172,0.2)',
//                   borderRadius: 20, marginBottom: 12,
//                 }}>
//                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac', animation: 'pulse 2s infinite' }} />
//                   <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
//                   <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#86efac', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
//                     Direct from Indian Farms
//                   </span>
//                 </div>
//                 <h1 style={{
//                   fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(28px, 4vw, 48px)',
//                   fontWeight: 400, color: '#f0fdf4', lineHeight: 1.1, letterSpacing: '-0.02em',
//                 }}>
//                   {selectedCollection === 'All Products' ? 'Millet Marketplace' : selectedCollection}
//                 </h1>
//                 <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8, fontFamily: "'Space Mono', monospace" }}>
//                   {filteredProducts.length} products · Verified FPOs & Farmer Collectives
//                 </p>
//               </div>

//               {/* Sort */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>SORT</span>
//                 <select
//                   value={sortOrder}
//                   onChange={(e) => setSortOrder(e.target.value)}
//                   style={{
//                     background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
//                     borderRadius: 10, padding: '8px 14px', color: 'rgba(255,255,255,0.7)',
//                     fontFamily: "'Space Mono', monospace", fontSize: 11, outline: 'none', cursor: 'pointer',
//                   }}
//                 >
//                   {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* ── Category Filter Bar ── */}
//           <div style={{
//             maxWidth: 1280, margin: '0 auto', padding: '0 24px 28px',
//             opacity: pageLoaded ? 1 : 0, transform: pageLoaded ? 'translateY(0)' : 'translateY(12px)',
//             transition: 'all 0.6s 0.1s cubic-bezier(0.23,1,0.32,1)',
//           }}>
//             <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
//               {categories.map((cat) => (
//                 <CategoryPill
//                   key={cat}
//                   name={cat}
//                   isActive={selectedCollection === cat}
//                   onClick={() => setSelectedCollection(cat)}
//                   count={categoryCounts[cat]}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* ── Main Content ── */}
//           <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
//             {filteredProducts.length > 0 ? (
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
//                 gap: 20,
//               }}>
//                 {filteredProducts.map((product, i) => (
//                   <ProductCard key={product.id} product={product} index={i} />
//                 ))}
//               </div>
//             ) : (
//               <div style={{
//                 display: 'flex', flexDirection: 'column', alignItems: 'center',
//                 justifyContent: 'center', height: 280, gap: 12,
//               }}>
//                 <div style={{ fontSize: 32, opacity: 0.3 }}>◌</div>
//                 <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", fontSize: 13 }}>
//                   No harvest found for "{searchTerm}"
//                 </p>
//                 <button
//                   onClick={() => { setSearchTerm(''); setSelectedCollection('All Products'); }}
//                   style={{
//                     background: 'none', border: '1px solid rgba(134,239,172,0.25)',
//                     color: '#86efac', borderRadius: 8, padding: '7px 16px',
//                     fontFamily: "'Space Mono', monospace", fontSize: 11, cursor: 'pointer',
//                   }}
//                 >Clear filters</button>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProdDisplay;


'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ── Icons ──────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);


// ── Types ───────────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string;
  origin?: string;
  badge?: string;
  rating: number;
  reviews: number;
};

type Category = string;

// ── Mock Data ───────────────────────────────────────────────────────────────────

const allProducts: Product[] = [
  { id: 'p1', name: 'Organic Foxtail Millet (Kangni)', price: 150, originalPrice: 180, category: 'Millets', imageUrl: '/foxtail1.jpg', origin: 'Rajasthan', badge: '15% OFF', rating: 4.8, reviews: 124 },
  { id: 'p2', name: 'Pearl Millet (Bajra) - Premium Quality', price: 120, category: 'Millets', imageUrl: '/pearlmillet.jpg', origin: 'Gujarat', badge: 'Bestseller', rating: 4.9, reviews: 312 },
  { id: 'p3', name: 'Sorghum (Jowar) Flour - Stone Ground', price: 90, originalPrice: 110, category: 'Flours', imageUrl: '/jowar.jpg', origin: 'Maharashtra', rating: 4.6, reviews: 89 },
  { id: 'p4', name: 'Cold-Pressed Coconut Oil - 1 Litre', price: 350, category: 'Oils', imageUrl: '/coconutoil.jpg', origin: 'Kerala', badge: 'New', rating: 4.7, reviews: 45 },
  { id: 'p5', name: 'Natural Forest Honey - Raw & Unprocessed', price: 450, category: 'Honey', imageUrl: '/honey.jpg', origin: 'Uttarakhand', rating: 4.9, reviews: 210 },
  { id: 'p6', name: 'Organic Ragi (Finger Millet) - Unpolished', price: 130, category: 'Millets', imageUrl: '/ragi.jpg', origin: 'Karnataka', badge: 'Organic', rating: 4.8, reviews: 178 },
  { id: 'p7', name: 'Kodo Millet - Diabetic Friendly', price: 160, originalPrice: 200, category: 'Millets', imageUrl: '/kodo.jpg', origin: 'Madhya Pradesh', badge: '20% OFF', rating: 4.5, reviews: 67 },
  { id: 'p8', name: 'Groundnut Oil (Cold-Pressed) - 1 Litre', price: 400, category: 'Oils', imageUrl: '/groundnut.jpg', origin: 'Andhra Pradesh', rating: 4.8, reviews: 156 },
];

const categories: Category[] = ['All Products', 'Millets', 'Flours', 'Oils', 'Honey', 'Spices'];

const sortOptions = [
  'Relevance', 'Trending', 'Latest arrivals', 'Price: Low to high', 'Price: High to low',
];

// ── Product Card ─────────────────────────────────────────────────────────────────

const ProductCard: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-200"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {product.badge}
          </div>
        )}
        
        {/* Heart/Wishlist Button (Decorative) */}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x400/f8fafc/0f172a?text=${encodeURIComponent(product.name.split(' ').slice(0, 2).join('+'))}`;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Origin */}
        <div className="flex justify-between items-center mb-2">
           <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{product.category}</span>
           {product.origin && (
             <span className="text-xs text-slate-400 flex items-center gap-1">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               {product.origin}
             </span>
           )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 leading-tight mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < Math.floor(product.rating)} />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500 ml-1">{product.rating} <span className="text-slate-400 font-normal">({product.reviews})</span></span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900">₹{product.price.toFixed(0)}</span>
              <span className="text-xs text-slate-500 font-medium">/ kg</span>
            </div>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toFixed(0)}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${hovered ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-emerald-50 text-emerald-600'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </div>
  );
};


// ── Main Component ───────────────────────────────────────────────────────────────

export default function ProdDisplay() {
  const router = useRouter();
  const [selectedCollection, setSelectedCollection] = useState<Category>('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(sortOptions[0]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];
    if (selectedCollection !== 'All Products') {
      products = products.filter(p => p.category === selectedCollection);
    }
    if (searchTerm) {
      products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    switch (sortOrder) {
      case 'Price: Low to high': products.sort((a, b) => a.price - b.price); break;
      case 'Price: High to low': products.sort((a, b) => b.price - a.price); break;
    }
    return products;
  }, [selectedCollection, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* ── Top Announcement Bar ── */}
      <div className="bg-emerald-800 text-emerald-50 py-2 px-4 text-center text-xs font-medium tracking-wide flex justify-center items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        100% Verified Farmer Produce. Free shipping on orders above ₹999.
      </div>

      {/* ── Main Navigation ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-sm">
                 <LeafIcon />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-slate-900 leading-tight tracking-tight">KrishiShetra</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Farmer Market</span>
              </div>
            </div>

            {/* Central Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search for fresh millets, pure honey, cold-pressed oils..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-100 border-transparent text-slate-900 text-sm rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
              <button className="text-slate-600 hover:text-emerald-600 transition-colors hidden sm:block">
                <UserIcon />
              </button>
              <button className="relative text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2">
                <div className="relative">
                  <CartIcon />
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    3
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-bold text-slate-800">₹850</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
              {selectedCollection === 'All Products' ? 'Fresh Marketplace' : selectedCollection}
            </h1>
            <p className="text-slate-500 text-sm">
              Showing {filteredProducts.length} authentic products directly sourced from farms.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
             <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sort By</span>
             <div className="relative">
               <select
                 value={sortOrder}
                 onChange={(e) => setSortOrder(e.target.value)}
                 className="appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-sm"
               >
                 {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"></path></svg>
               </div>
             </div>
          </div>
        </div>

        {/* ── Layout Grid (Sidebar + Products) ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Categories</h2>
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const isActive = selectedCollection === cat;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setSelectedCollection(cat)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                          {cat}
                        </span>
                        {/* Mock counts just for visual design */}
                        <span className={`text-xs ${isActive ? 'bg-emerald-200/50 text-emerald-700' : 'bg-slate-100 text-slate-500'} py-0.5 px-2 rounded-full`}>
                           {cat === 'All Products' ? allProducts.length : Math.floor(Math.random() * 5) + 1}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* Promotional Banner in Sidebar */}
              <div className="mt-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-5 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                    <LeafIcon />
                 </div>
                 <h3 className="font-bold text-lg leading-tight mb-2">Support Local FPOs</h3>
                 <p className="text-emerald-100 text-xs mb-4">Every purchase directly supports sustainable farming practices.</p>
                 <button className="bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-50 transition-colors w-full">
                    Learn More
                 </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => router.push(`/products/${product.id}`)} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <SearchIcon />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 max-w-md mb-6">
                  We couldn't find any produce matching "{searchTerm}". Try checking your spelling or clearing the filters.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCollection('All Products'); }}
                  className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}