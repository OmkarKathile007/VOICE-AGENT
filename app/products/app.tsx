// app/page.tsx

'use client';

import { products } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';

// Animation for the grid container
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child fades in 0.1s after the previous
    },
  },
};

export default function HomePage() {
  // Filter products by category for different sections
  const rawMillets = products.filter((p) => p.category === 'Raw Millets');
  const processedProducts = products.filter((p) => p.category === 'Processed');
  const agriTech = products.filter((p) => p.category === 'Agri-Tech');

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      {/* Section 1: Raw Millets (B2B) */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Raw Millets (Farm-to-Buyer)
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {rawMillets.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      {/* Section 2: Processed Products (B2C) */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Processed & Value-Added Products
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {processedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      {/* Section 3: Agri-Tech Tools */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Millet Processing & Agri-Tech
        </h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {agriTech.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>
    </div>
  );
}