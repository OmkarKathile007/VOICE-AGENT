"use client";

import Image from "next/image";
import React from "react";
import exclusiveImage from "@/components/Assets/exclusive_image.png";

const Offers: React.FC = () => {
  return (
    <section className="w-[90%] md:w-[80%] min-h-[60vh] mx-auto flex flex-col md:flex-row justify-center items-center bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] px-6 md:px-20 rounded-2xl shadow-md mt-10 md:mt-16">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-3 md:space-y-4">
        <h1 className="text-[#171717] text-4xl md:text-6xl font-semibold">Exclusive</h1>
        <h1 className="text-[#171717] text-4xl md:text-6xl font-semibold">Offers for You</h1>
        <p className="text-[#171717] text-lg md:text-2xl font-medium">
          ONLY ON BEST SELLER PRODUCTS
        </p>
        <button className="mt-6 h-14 w-60 md:h-[70px] md:w-[282px] bg-[#ff4141] text-white text-lg md:text-xl font-medium rounded-full hover:bg-[#e13b3b] transition duration-300">
          Check Now
        </button>
      </div>

      {/* Right Image */}
      <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
        <Image
          src={exclusiveImage}
          alt="Exclusive Offer"
          className="w-[250px] md:w-[350px] lg:w-[450px] object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default Offers;
