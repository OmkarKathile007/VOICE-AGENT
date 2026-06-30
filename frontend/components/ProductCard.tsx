// components/ProductCard.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, ShoppingCart, Truck, Video } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

// Animation variants for Framer Motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03 }} // Smooth scale on hover
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
    >
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        {/* Product Image & Badges */}
        <div className="relative w-full h-48">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {product.isVerifiedFPO && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck size={14} /> Verified FPO
            </span>
          )}
          {product.category === 'Combo' && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex-grow flex flex-col">
          <p className="text-sm text-gray-500">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-900 truncate mt-1">
            {product.name}
          </h3>

          {/* Conditional Price Display */}
          <div className="mt-2">
            <span className="text-xl font-bold text-green-700">
              ₹{product.price}
            </span>
            {product.category === 'Raw Millets' && (
              <span className="text-sm text-gray-500"> / kg</span>
            )}
          </div>

          {/* Conditional Info (Rating vs. Raw Specs) */}
          {product.category === 'Processed' || product.category === 'Combo' ? (
            <div className="flex items-center mt-1 gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-1">
              Moisture: {product.moisture} | Origin: {product.origin}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Conditional Action Buttons */}
          <div className="mt-4">
            {product.category === 'Raw Millets' && (
              <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors">
                <Truck size={18} /> Bulk Order
              </button>
            )}
            {product.category === 'Processed' || product.category === 'Combo' ? (
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                <ShoppingCart size={18} /> Add to Cart
              </button>
            ) : null}
            {product.category === 'Agri-Tech' && (
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <Video size={18} /> View Demo
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}