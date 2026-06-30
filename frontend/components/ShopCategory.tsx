"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { ShopContext } from "@/context/ShopContext";
import Item from "@/components/Item";
import dropdownIcon from "@/components/Assets/dropdown_icon.png";

interface ShopCategoryProps {
  banner: string;
  category: string;
}

const ShopCategory: React.FC<ShopCategoryProps> = ({ banner, category }) => {
  const shopContext = useContext(ShopContext);
  if (!shopContext) {
    return null;
  }
  const { all_product } = shopContext;

  return (
    <div className="flex flex-col items-center w-full pb-16">
      {/* Banner */}
      <div className="w-full">
        <Image
          src={banner}
          alt={`${category} banner`}
          className="w-full h-[200px] md:h-[300px] object-cover rounded-lg shadow-md"
          priority
        />
      </div>

      {/* Index and Sort Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-[90%] md:w-[80%] mt-6">
        <p className="text-gray-800 text-lg font-medium">
          <span className="font-semibold">Showing 1–12</span> out of 36 products
        </p>

        <div className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full mt-3 sm:mt-0 cursor-pointer hover:bg-gray-50">
          <span className="text-gray-700 font-medium text-sm">Sort by</span>
          <Image
            src={dropdownIcon}
            alt="dropdown icon"
            className="w-4 h-4"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 w-[90%] md:w-[80%]">
        {all_product.map((item: any, i: number) => {
          if (category === item.category) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Load More Button */}
      <button className="mt-12 bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition duration-300">
        Explore More
      </button>
    </div>
  );
};

export default ShopCategory;
