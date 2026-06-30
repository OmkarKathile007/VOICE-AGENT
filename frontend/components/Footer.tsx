"use client";

import Image from "next/image";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col justify-center items-center gap-12 sm:gap-16 px-4 sm:px-6 md:px-10 py-16 bg-white text-center">
      {/* Logo */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Image
          src="/assets/logo_big.png"
          alt="UrbanThreads Logo"
          width={60}
          height={60}
          className="object-contain"
        />
        <p className="text-[#383838] text-3xl sm:text-4xl md:text-[46px] font-bold">
          UrbanThreads
        </p>
      </div>

      {/* Links */}
      <ul className="flex flex-wrap justify-center list-none gap-6 sm:gap-10 text-gray-800 text-base sm:text-lg md:text-xl font-medium">
        <li className="cursor-pointer hover:text-gray-600 transition">Company</li>
        <li className="cursor-pointer hover:text-gray-600 transition">Products</li>
        <li className="cursor-pointer hover:text-gray-600 transition">Offices</li>
        <li className="cursor-pointer hover:text-gray-600 transition">About</li>
        <li className="cursor-pointer hover:text-gray-600 transition">Contact</li>
      </ul>

      {/* Social Icons */}
      <div className="flex gap-5 sm:gap-6">
        {[
          "/assets/instagram_icon.png",
          "/assets/pintester_icon.png",
          "/assets/whatsapp_icon.png",
        ].map((icon, index) => (
          <div
            key={index}
            className="p-2 sm:p-3 bg-[#fbfbfb] border border-gray-200 rounded-md hover:scale-105 transition"
          >
            <Image src={icon} alt="social icon" width={24} height={24} />
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="flex flex-col items-center gap-6 w-full text-gray-800 text-sm sm:text-base md:text-lg">
        <hr className="w-4/5 border-none rounded-lg h-[3px] bg-gray-300" />
        <p>Copyright © 2024 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
