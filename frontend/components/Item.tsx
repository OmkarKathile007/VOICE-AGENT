"use client";

import React from "react";
import Link from "next/link";

interface ItemProps {
  id: number | string;
  image: string;
  name: string;
  new_price: number;
  old_price: number;
}

const Item: React.FC<ItemProps> = ({ id, image, name, new_price, old_price }) => {
  return (
    <div className="item w-[280px] sm:w-[320px] md:w-[350px] flex flex-col transition-transform duration-500 hover:scale-105">
      <Link
        href={`/product/${id}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="block"
      >
        <img
          src={image}
          alt={name}
          className="w-full h-auto object-cover rounded-lg shadow-sm"
        />
      </Link>

      <p className="mt-2 text-[#171717] text-base sm:text-lg font-medium truncate">
        {name}
      </p>

      <div className="flex gap-4 mt-1 items-center">
        <div className="text-[#374151] text-[16px] sm:text-[18px] font-semibold">
          ${new_price}
        </div>
        <div className="text-[#8c8c8c] text-[15px] sm:text-[17px] font-medium line-through">
          ${old_price}
        </div>
      </div>
    </div>
  );
};

export default Item;
