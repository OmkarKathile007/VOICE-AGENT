"use client";

import Image from "next/image";

type Product = {
  category: string;
  name: string;
};

type BreadCrumsProps = {
  product: Product;
};

const BreadCrums: React.FC<BreadCrumsProps> = ({ product }) => {
  return (
    <div
      className="
        flex flex-wrap items-center gap-2
        text-gray-600 text-sm sm:text-base font-semibold
        capitalize
        mx-4 my-6 sm:mx-10 md:mx-20 lg:mx-[170px] lg:my-[60px]
      "
    >
      <span>HOME</span>
      <Image
        src="/assets/breadcrum_arrow.png"
        alt="arrow"
        width={12}
        height={12}
        className="w-3 h-3"
      />
      <span>SHOP</span>
      <Image
        src="/assets/breadcrum_arrow.png"
        alt="arrow"
        width={12}
        height={12}
        className="w-3 h-3"
      />
      <span>{product.category}</span>
      <Image
        src="/assets/breadcrum_arrow.png"
        alt="arrow"
        width={12}
        height={12}
        className="w-3 h-3"
      />
      <span>{product.name}</span>
    </div>
  );
};

export default BreadCrums;
