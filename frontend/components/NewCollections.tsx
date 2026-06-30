"use client";

import React from "react";
import Image from "next/image";
import Item from "@/components/Item";
import newCollections from "@/components/Assets/new_collections"; // adjust import path

const NewCollections: React.FC = () => {
  return (
    <section className="flex flex-col items-center gap-3 my-24 px-6 md:px-16">
      <h1 className="text-3xl md:text-5xl font-semibold text-[#171717] text-center">
        NEW COLLECTIONS
      </h1>
      <hr className="w-40 h-1.5 md:h-2 rounded-full bg-[#252525]" />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 w-full max-w-7xl">
        {newCollections.map((item, i) => (
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

export default NewCollections;
