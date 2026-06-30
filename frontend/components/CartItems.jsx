"use client";

import { useContext } from "react";
import Image from "next/image";
import { ShopContext } from "@/context/ShopContext"; // adjust path if needed

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItem, removeFromCart } =
    useContext(ShopContext);

  return (
    <div className="cartitems mx-4 sm:mx-10 md:mx-20 lg:mx-[170px] my-16">
      {/* Header Row */}
      <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center gap-6 sm:gap-10 text-gray-700 text-base sm:text-lg font-semibold">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr className="h-[3px] bg-gray-200 border-0 my-2" />

      {/* Cart Items */}
      {all_product.map((e) => {
        if (cartItem[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] items-center gap-6 sm:gap-10 text-gray-700 text-sm sm:text-base font-medium py-3">
                <Image
                  src={e.image}
                  alt={e.name}
                  width={62}
                  height={62}
                  className="object-contain"
                />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="w-16 h-12 border-2 border-gray-200 bg-white">
                  {cartItem[e.id]}
                </button>
                <p>${e.new_price * cartItem[e.id]}</p>
                <Image
                  src="/assets/cart_cross_icon.png"
                  alt="remove"
                  width={15}
                  height={15}
                  className="cursor-pointer mx-4"
                  onClick={() => removeFromCart(e.id)}
                />
              </div>
              <hr className="h-[2px] bg-gray-200 border-0" />
            </div>
          );
        }
        return null;
      })}

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row justify-between mt-20 gap-10">
        {/* Total Section */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Cart Total</h1>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <h3 className="font-semibold">Total</h3>
              <h3 className="font-semibold">${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button className="w-full sm:w-[262px] h-[58px] bg-red-500 text-white font-semibold hover:bg-red-600 transition">
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* Promo Code Section */}
        <div className="flex-1">
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            If you have a promo code, enter it here
          </p>
          <div className="flex mt-3 h-[58px] bg-gray-200 overflow-hidden w-full sm:w-[504px] rounded">
            <input
              type="text"
              placeholder="Promo Code"
              className="flex-1 bg-transparent border-none outline-none px-4 text-base"
            />
            <button className="w-[170px] bg-black text-white text-base hover:bg-gray-800 transition">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
