"use client";

import React from "react";
import Item from "@/components/Item";
import data_product from "@/components/Assets/data";

import { StaticImageData } from "next/image";

interface Product {
  id: number;
  name: string;
  image: StaticImageData;
  new_price: number;
  old_price: number;
}

const RelatedProduct: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-3 min-h-[90vh]">
      <h1 className="text-gray-900 text-4xl md:text-5xl font-semibold">
        Related Products
      </h1>
      <hr className="w-48 h-1.5 rounded-full bg-neutral-800" />

      <div className="mt-12 flex flex-wrap justify-center gap-8">

        {data_product.map((item: Product, i: number) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image.src}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
