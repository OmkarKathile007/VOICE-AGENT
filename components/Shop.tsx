"use client";

import React from "react";
import Hero from "@/components/Hero";
import Popular from "@/components/Popular";
import Offers from "@/components/Offers";
import NewCollections from "@/components/NewCollections";
import NewsLetter from "@/components/NewsLetter";

const Shop: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full bg-white">
      {/* Hero Section */}
      <section className="w-full">
        <Hero />
      </section>

      {/* Popular Section */}
      <section className="w-full mt-10 md:mt-20">
        <Popular />
      </section>

      {/* Offers Section */}
      <section className="w-full mt-10 md:mt-20">
        <Offers />
      </section>

      {/* New Collections */}
      <section className="w-full mt-10 md:mt-20">
        <NewCollections />
      </section>

      {/* Newsletter Section */}
      <section className="w-full mt-10 md:mt-20 mb-20">
        <NewsLetter />
      </section>
    </div>
  );
};

export default Shop;
