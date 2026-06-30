"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import BreadCrums from "@/components/BreadCrums";
import ProductDisplay from "@/components/ProductDisplay";
import DescriptionBox from "@/components/DescriptionBox";
import RelatedProduct from "@/components/RelatedProduct";

const ProductPage: React.FC = () => {
  const { all_product } = useShop();
  const params = useParams();

  // productId will be a string from the URL
  const productId = Number(params?.productId);
  const product = all_product.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">Product Not Found</h1>
        <p className="text-gray-500">The product you’re looking for doesn’t exist.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <BreadCrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProduct />
    </div>
  );
};

export default ProductPage;
