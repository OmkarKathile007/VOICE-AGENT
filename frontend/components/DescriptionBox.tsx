"use client";

import React from "react";

const DescriptionBox: React.FC = () => {
  return (
    <div className="descriptionbox mx-4 sm:mx-10 md:mx-20 lg:mx-[170px] my-[120px]">
      {/* Navigator */}
      <div className="flex">
        <div className="flex items-center justify-center text-sm sm:text-base font-semibold w-[150px] sm:w-[171px] h-[60px] sm:h-[70px] border border-gray-300">
          Description
        </div>
        <div className="flex items-center justify-center text-sm sm:text-base font-semibold w-[150px] sm:w-[171px] h-[60px] sm:h-[70px] border border-gray-300 bg-[#FBFBFB] text-gray-600">
          Reviews (122)
        </div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col gap-6 border border-gray-300 p-6 sm:p-10 lg:p-12 pb-16 text-gray-700 text-sm sm:text-base leading-relaxed">
        <p>
          An e-commerce website is an online platform that facilitates the buying
          and selling of products or services over the internet. It serves as a
          virtual marketplace where businesses and individuals showcase their
          products, interact with customers, and conduct transactions without
          the need for physical presence. E-commerce websites have gained immense
          popularity due to their convenience, accessibility, and the global reach
          they offer.
        </p>
        <p>
          E-commerce websites typically display products or services with detailed
          descriptions, images, prices, and available options (e.g., sizes,
          colors). Each product usually has its own dedicated page with relevant
          information.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
