"use client";

import Image from "next/image";
import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="hero h-[100vh] bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] flex flex-col-reverse md:flex-row items-center justify-center px-6 sm:px-10 md:px-16 lg:px-[140px]">
      {/* LEFT SIDE */}
      <div className="hero-left flex-1 flex flex-col justify-center gap-5 md:gap-6 text-left">
        <h2 className="text-[#090909] text-xl sm:text-2xl font-semibold tracking-wide">
          NEW ARRIVALS ONLY
        </h2>

        <div>
          <div className="flex items-center gap-4 sm:gap-5 mb-2">
            <p className="text-[#171717] text-5xl sm:text-6xl md:text-[70px] font-bold">
              new
            </p>
            <Image
              src="/assets/hand_icon.png"
              alt="hand icon"
              width={100}
              height={100}
              className="w-16 sm:w-20 md:w-[100px]"
            />
          </div>
          <p className="text-[#171717] text-5xl sm:text-6xl md:text-[70px] font-bold leading-tight">
            Collections
          </p>
          <p className="text-[#171717] text-5xl sm:text-6xl md:text-[70px] font-bold leading-tight">
            for everyone
          </p>
        </div>

        <button className="flex items-center justify-center gap-3 sm:gap-4 w-[240px] sm:w-[280px] md:w-[310px] h-[60px] sm:h-[65px] md:h-[70px] mt-6 rounded-full bg-[#ff4141] text-white text-lg sm:text-xl font-medium hover:bg-[#e83838] transition">
          <span>Latest Collection</span>
          <Image
            src="/assets/arrow.png"
            alt="arrow icon"
            width={20}
            height={20}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="hero-right flex-1 flex items-center justify-center md:justify-end pr-0 md:pr-12 lg:pr-[100px] mb-8 md:mb-0">
        <Image
          src="/assets/hero_image.png"
          alt="Hero Image"
          width={500}
          height={650}
          className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] w-auto object-contain"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
