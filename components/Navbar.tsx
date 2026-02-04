"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShopContext } from "@/context/ShopContext" // adjust path as needed
import { Menu, X } from "lucide-react"; // for responsive toggle icons

const Navbar: React.FC = () => {
  const [menu, setMenu] = useState("shop");
  const [isOpen, setIsOpen] = useState(false);
  const shopContext = useContext(ShopContext);
  const getTotalCartItems = shopContext?.getTotalCartItems ?? (() => 0);

  const navLinks = [
    { label: "Shop", href: "/", key: "shop" },
    { label: "Men", href: "/mens", key: "mens" },
    { label: "Women", href: "/womens", key: "womens" },
    { label: "Kids", href: "/kids", key: "kids" },
  ];

  return (
    <nav className="w-full shadow-sm bg-white fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center px-6 md:px-16 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="UrbanThreads Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <p className="text-2xl sm:text-3xl font-semibold text-[#171717]">
            UrbanThreads
          </p>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-10 text-[#626262] font-medium">
          {navLinks.map((link) => (
            <li
              key={link.key}
              onClick={() => setMenu(link.key)}
              className="flex flex-col items-center cursor-pointer"
            >
              <Link href={link.href} className="hover:text-[#FF4141]">
                {link.label}
              </Link>
              {menu === link.key && (
                <hr className="border-none w-3/4 h-[3px] rounded-full bg-[#FF4141]" />
              )}
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <Link href="/login">
            <button className="hidden sm:block w-[120px] sm:w-[150px] h-[45px] sm:h-[50px] border border-gray-400 rounded-full text-gray-700 text-base font-medium hover:bg-gray-100 transition">
              Login
            </button>
          </Link>

          <Link href="/cart" className="relative">
            <Image
              src="/assets/cart_icon.png"
              alt="Cart"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {getTotalCartItems()}
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <ul className="flex flex-col items-center gap-4 pb-4 bg-white border-t md:hidden text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li
              key={link.key}
              onClick={() => {
                setMenu(link.key);
                setIsOpen(false);
              }}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
          <Link href="/login">
            <button className="w-[120px] border border-gray-400 rounded-full text-gray-700 text-sm py-2 hover:bg-gray-100 transition">
              Login
            </button>
          </Link>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
