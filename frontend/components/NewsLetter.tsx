"use client";

import React from "react";

const NewsLetter = () => {
  return (
    <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto my-24 sm:my-32 flex flex-col items-center justify-center gap-6 sm:gap-8 bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] rounded-3xl px-6 sm:px-10 py-16">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-800 text-center leading-snug">
        Get Exclusive Offers on Your Email
      </h1>

      <p className="text-gray-700 text-sm sm:text-base md:text-lg text-center">
        Subscribe to our newsletter and stay updated
      </p>

      {/* Input and Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-full border border-gray-200 w-full sm:w-[90%] md:w-[730px] shadow-sm overflow-hidden">
        <input
          type="email"
          placeholder="Your Email ID"
          className="w-full sm:flex-1 px-6 py-3 sm:py-4 outline-none border-none text-gray-700 text-sm sm:text-base font-medium"
        />
        <button className="w-full sm:w-[200px] py-3 sm:py-4 bg-gray-800 text-white rounded-full sm:rounded-r-full sm:rounded-l-none text-sm sm:text-base font-medium hover:bg-gray-700 active:scale-95 transition-all duration-200">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
