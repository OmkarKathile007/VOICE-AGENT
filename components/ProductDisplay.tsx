"use client";

import React from "react";
import Image from "next/image";
import { useShop } from "@/context/ShopContext";
import star_icon from "@/components/Assets/star_icon.png";
import star_dull_icon from "@/components/Assets/star_dull_icon.png";

interface Product {
  id: number;
  name: string;
  image: string;
  new_price: number;
  old_price: number;
}

interface ProductDisplayProps {
  product: Product;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  const { addToCart } = useShop();

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 px-4 sm:px-8 md:px-16 lg:px-24 py-10">
      {/* -------- Left Side - Product Images -------- */}
      <div className="flex flex-col sm:flex-row gap-5 lg:w-1/2 justify-center">
        {/* Thumbnail list */}
        <div className="flex sm:flex-col gap-4 sm:gap-5 items-center sm:items-start justify-center">
          {[...Array(4)].map((_, i) => (
            <Image
              key={i}
              src={product.image}
              alt={product.name}
              width={100}
              height={120}
              className="rounded-lg object-cover border border-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer w-20 h-24 sm:w-24 sm:h-28"
            />
          ))}
        </div>

        {/* Main image */}
        <div className="flex justify-center items-center w-full sm:w-auto">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={600}
            className="rounded-xl shadow-md object-cover w-full sm:w-[400px] md:w-[480px] lg:w-[500px] max-h-[600px]"
          />
        </div>
      </div>

      {/* -------- Right Side - Product Details -------- */}
      <div className="flex flex-col gap-4 lg:w-1/2">
        {/* Product name */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
          {product.name}
        </h1>

        {/* Rating stars */}
        <div className="flex items-center gap-2 mt-1">
          {[...Array(4)].map((_, i) => (
            <Image key={i} src={star_icon} alt="star" width={20} height={20} />
          ))}
          <Image src={star_dull_icon} alt="star" width={20} height={20} />
          <p className="text-gray-600 text-sm">(122)</p>
        </div>

        {/* Prices */}
        <div className="flex flex-wrap items-center gap-5 my-4 text-lg sm:text-xl font-semibold">
          <span className="line-through text-gray-500">
            ₹{product.old_price}
          </span>
          <span className="text-red-500 text-2xl">₹{product.new_price}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          A lightweight, knitted pullover shirt with a round neckline and short sleeves,
          perfect for casual wear or layering.
        </p>

        {/* Size selector */}
        <div className="mt-6">
          <h2 className="text-gray-700 text-lg font-semibold mb-3">
            Select Size
          </h2>
          <div className="flex flex-wrap gap-3">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className="px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm font-medium transition"
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product.id)}
          className="mt-6 w-full sm:w-auto bg-red-500 text-white font-medium px-8 py-3 rounded-lg hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-md"
        >
          ADD TO CART
        </button>

        {/* Category / Tags */}
        <div className="mt-4 text-gray-700 text-sm sm:text-base">
          <p className="mt-1">
            <span className="font-semibold">Category:</span> Women, T-shirt,
            Crop Top
          </p>
          <p>
            <span className="font-semibold">Tags:</span> Modern, Latest
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
