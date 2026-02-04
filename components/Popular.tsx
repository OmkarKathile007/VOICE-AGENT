"use client";

import React from "react";
import Item from "@/components/Item";
import data_product from "@/components/Assets/data";

const Popular: React.FC = () => {
  return (
    <section className="flex flex-col items-center gap-4 py-10 md:py-16 min-h-[90vh] bg-white">
      <h1 className="text-[#171717] text-3xl md:text-5xl font-semibold text-center">
        Popular In Women
      </h1>

      <hr className="w-32 md:w-52 h-[6px] rounded-full bg-[#252525]" />

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 px-4 md:px-8">
        {data_product.map((item, i) => (
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
    </section>
  );
};

export default Popular;
