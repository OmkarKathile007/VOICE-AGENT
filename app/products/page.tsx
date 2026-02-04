'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- ICONS ---
// We'll use lucide-react for icons.
// In a real Next.js app, you would install it: npm install lucide-react
// For this single-file example, I'll use simple SVG paths as components.

const Search: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ShoppingCart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// --- TYPES ---

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

type Category = string;

// --- MOCK DATA ---
// Mock data for KrishiShetr products
const allProducts: Product[] = [
  {
    id: 'p1',
    name: 'Organic Foxtail Millet',
    price: 150.0,
    category: 'Millets',
    imageUrl: '/foxtail1.jpg',
  },
  {
    id: 'p2',
    name: 'Pearl Millet (Bajra)',
    price: 120.0,
    category: 'Millets',
    imageUrl: '/pearlmillet.jpg',
  },
  {
    id: 'p3',
    name: 'Sorghum (Jowar) Flour',
    price: 90.0,
    category: 'Flours',
    imageUrl: '/jowar.jpg',
  },
  {
    id: 'p4',
    name: 'Cold-Pressed Coconut Oil',
    price: 350.0,
    category: 'Oils',
    imageUrl: '/coconutoil.jpg',
  },
  {
    id: 'p5',
    name: 'Natural Forest Honey',
    price: 450.0,
    category: 'Honey',
    imageUrl: '/honey.jpg',
  },
  {
    id: 'p6',
    name: 'Organic Ragi (Finger Millet)',
    price: 130.0,
    category: 'Millets',
    imageUrl: '/ragi.jpg',
  },
  {
    id: 'p7',
    name: 'Kodo Millet',
    price: 160.0,
    category: 'Millets',
    imageUrl: '/kodo.jpg',
  },
  {
    id: 'p8',
    name: 'Groundnut Oil (Cold-Pressed)',
    price: 400.0,
    category: 'Oils',
    imageUrl: '/groundnut.jpg',
  },
];

const categories: Category[] = [
  'All Products',
  'Millets',
  'Flours',
  'Oils',
  'Honey',
  'Spices',
];

const sortOptions = [
  'Relevance',
  'Trending',
  'Latest arrivals',
  'Price: Low to high',
  'Price: High to low',
];

// --- HELPER COMPONENTS ---

// Product Card Component
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const handleProductClick = () => {
    // In a real Next.js app, you would use router.push() or <Link>
     router.push(`/products/${product.id}`)
    console.log(`Redirecting to product: ${product.name} (ID: ${product.id})`);
    // Using a custom modal or toast is better than alert() in a real app
    // For this demo, alert() is used for simplicity.
    // A better approach would be a state-managed modal.
  };

  return (
    <a
      href={`#product-${product.id}`} // Use a hash link for single-page demo
      onClick={(e) => {
        e.preventDefault(); // Prevent hash link jump
        handleProductClick();
      }}
      className="group"
    >
      {/* FIX 1: 
        - Replaced `aspect-w-1 aspect-h-1` with `aspect-square` (modern Tailwind for 1:1 ratio).
        - Changed `bg-neutral-800` to `bg-neutral-900` to contrast with the page background.
      */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
        {/*
          FIX 2:
          - Changed `object-cover` (crops image) to `object-contain` (fits image).
          - Removed `group-hover:scale-105` as it looks odd with `object-contain`.
        */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain object-center transition-all duration-300 ease-in-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x400/374151/FFFFFF?text=${encodeURIComponent(product.name)}`;
          }}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-300">{product.name}</h3>
      <p className="mt-1 text-lg font-medium text-white">
        ₹{product.price.toFixed(2)}
      </p>
    </a>
  );
};

// Sidebar Collection Link
interface CollectionLinkProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const CollectionLink: React.FC<CollectionLinkProps> = ({ name, isActive, onClick }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-emerald-700 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {name}
    </a>
  );
};


// --- MAIN APP COMPONENT ---

const ProdDisplay: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<Category>('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(sortOptions[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized filtering logic
  const filteredProducts = useMemo(() => {
    let products = [...allProducts]; // Create a new array to sort

    // Filter by collection
    if (selectedCollection !== 'All Products') {
      products = products.filter(p => p.category === selectedCollection);
    }

    // Filter by search term
    if (searchTerm) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortOrder) {
      case 'Price: Low to high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to low':
        products.sort((a, b) => b.price - a.price);
        break;
      // Add other sort logic (e.g., 'Trending') if data supports it
      default:
        // Default to relevance (original order)
        break;
    }

    return products;
  }, [selectedCollection, searchTerm, sortOrder]);

  const handleCollectionClick = (category: Category) => {
    setSelectedCollection(category);
    // In a real app, you might update the URL query params here
    // e.g., router.push(`/?collection=${category}`)
    console.log(`Navigating to collection: ${category}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already real-time, but this could trigger a formal search API call
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="min-h-screen bg-neutral-800 font-sans text-white">
      {/* --- Header --- */}
      <header className="sticky top-0 z-10 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo and Desktop Nav */}
            <div className="flex items-center space-x-8">
              <a href="#" className="flex-shrink-0">
                <span className="text-2xl font-bold text-emerald-500">
                  KrishiShetra
                </span>
              </a>
              
            </div>

            {/* Search Bar */}
            <div className="flex-1 px-4 md:px-12">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for millet, oils, honey..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
              </form>
            </div>

            {/* Cart and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                type="button"
                className="rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <span className="sr-only">View cart</span>
                <ShoppingCart className="h-6 w-6" />
              </button>
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="ml-4 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
        
        {/* Mobile menu, show/hide based on menu state. */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">All</a>
              <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Millets</a>
              <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Oils</a>
            </div>
            {/* Mobile Collections */}
            <div className="border-t border-gray-700 pt-4 pb-3">
                <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Collections</h3>
                <div className="mt-3 space-y-1 px-2">
                    {categories.map((category) => (
                      <CollectionLink
                        key={category}
                        name={category}
                        isActive={selectedCollection === category}
                        onClick={() => {
                          handleCollectionClick(category);
                          setIsMobileMenuOpen(false);
                        }}
                      />
                    ))}
                </div>
            </div>
          </div>
        )}
      </header>

      {/* --- Main Content --- */}
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row">
            
            {/* Sidebar (Collections) */}
            <aside className="hidden w-full py-6 pr-8 md:block md:w-64">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Collections
              </h2>
              <nav className="mt-4 space-y-1">
                {categories.map((category) => (
                  <CollectionLink
                    key={category}
                    name={category}
                    isActive={selectedCollection === category}
                    onClick={() => handleCollectionClick(category)}
                  />
                ))}
              </nav>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 py-6">
              
              {/* Sort By Dropdown */}
              <div className="mb-6 flex items-baseline justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {selectedCollection}
                </h1>

                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none rounded-md border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-sm font-medium text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {filteredProducts.map((product) => (
                    <ProductCard  key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <p className="text-xl text-gray-500">No products found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* --- Footer --- */}
     
    </div>
  );
};

export default ProdDisplay;

// "use client";

// import React from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Shop from "@/components/Shop";
// import ShopCategory from "@/components/ShopCategory";
// import Product from "@/components/Product";
// import Cart from "@/components/CartItems";
// // import LoginSignUp from "@/components/LoginSignUp";

// import men_banner from "@/components/Assets/banner_mens.png";
// import women_banner from "@/components/Assets/banner_women.png";
// import kid_banner from "@/components/Assets/banner_kids.png";

// export default function Page() {
//   return (
//     <div className="min-h-screen flex flex-col bg-white text-gray-900">
//       <Navbar />

//       {/* Example main content area (home/shop page) */}
//       <main className="flex-1">
//         {/* By default, render the Shop page here */}
//         <Shop />

//         {/* You can swap the below for category pages as needed */}
//         <ShopCategory banner={men_banner} category="men" /> 
//          <ShopCategory banner={women_banner} category="women" />
//       <ShopCategory banner={kid_banner} category="kid" /> 
//         <Product />
//         <Cart /> 
//         {/* <LoginSignUp /> */}
//       </main>

//       <Footer />
//     </div>
//   );
// }


