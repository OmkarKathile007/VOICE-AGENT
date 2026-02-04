// // "use client";

// // import React, { createContext, useState, ReactNode, useContext } from "react";
// // import all_product from "@/components/Assets/all_product"; // Adjust path as needed

// // // ✅ Type for Product (adjust fields to match your all_product)
// // export interface Product {
// //   id: number;
// //   name: string;
// //   new_price: number;
// //   old_price?: number;
// //   [key: string]: any; // fallback for extra props
// // }

// // // ✅ Type for the context value
// // interface ShopContextType {
// //   all_product: Product[];
// //   cartItems: Record<number, number>;
// //   addToCart: (itemId: number) => void;
// //   removeFromCart: (itemId: number) => void;
// //   getTotalCartAmount: () => number;
// //   getTotalCartItems: () => number;
// // }

// // // ✅ Default context (will be overridden by provider)
// // export const ShopContext = createContext<ShopContextType | undefined>(undefined);

// // // ✅ Helper to initialize cart
// // const getDefaultCart = (products: Product[]) => {
// //   const cart: Record<number, number> = {};
// //   for (let i = 0; i < products.length; i++) {
// //     cart[products[i].id] = 0;
// //   }
// //   return cart;
// // };

// // interface ShopContextProviderProps {
// //   children: ReactNode;
// // }

// // export const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
// //   const [cartItems, setCartItems] = useState<Record<number, number>>(
// //     getDefaultCart(all_product)
// //   );

// //   const addToCart = (itemId: number) => {
// //     setCartItems((prev) => ({
// //       ...prev,
// //       [itemId]: (prev[itemId] || 0) + 1,
// //     }));
// //   };

// //   const removeFromCart = (itemId: number) => {
// //     setCartItems((prev) => ({
// //       ...prev,
// //       [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
// //     }));
// //   };

// //   const getTotalCartAmount = () => {
// //     let totalAmount = 0;
// //     for (const itemId in cartItems) {
// //       const quantity = cartItems[itemId];
// //       if (quantity > 0) {
// //         const product = all_product.find((p) => p.id === Number(itemId));
// //         if (product) {
// //           totalAmount += product.new_price * quantity;
// //         }
// //       }
// //     }
// //     return totalAmount;
// //   };

// //   const getTotalCartItems = () => {
// //     return Object.values(cartItems).reduce((acc, count) => acc + count, 0);
// //   };

// //   const value: ShopContextType = {
// //     all_product,
// //     cartItems,
// //     addToCart,
// //     removeFromCart,
// //     getTotalCartAmount,
// //     getTotalCartItems,
// //   };

// //   return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
// // };

// // // ✅ Optional: Hook for easy use
// // export const useShop = (): ShopContextType => {
// //   const context = useContext(ShopContext);
// //   if (context==null) {
// //     throw new Error("useShop must be used within a ShopContextProvider");
// //   }
// //   return context;
// // };

// import React, { createContext, useState } from 'react'

// import all_product from "@/components/Assets/all_product"


// export const ShopContext = createContext(null);

// const getDefaultCart = () => {
//     let cart={}
//     for (let index = 0; index < all_product.length+1; index++) {
      
//         cart[index]=0;
//     }
//     return cart;
// }

// const ShopContextProvider = (props) => {
//     const[cartItem,setCartItems]=useState(getDefaultCart())
//     // const contextvalue = { all_product ,cartItem}

//     // console.log(cartItem)
//     const addToCart=(itemId)=>{
//          setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
//          console.log(cartItem)
//     }
//     const removeFromCart=(itemId)=>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
//    }
    

//    const getTotalCartAmount=()=>{
//     let totalAmount=0;
//     for(const item in cartItem){
//         if(cartItem[item]>0){
//             let itemInfo=all_product.find((product)=>product.id===Number(item))
//             totalAmount+=itemInfo.new_price * cartItem[item];
//         }
//         return totalAmount;
//     }
//    }

//    const getTotalCartItems=()=>{
//     let totalItem=0;
//     for(const item in cartItem){
//         if(cartItem[item]>0){
//             totalItem+=cartItem[item];
//         }

       
//     }
//     return totalItem;

//    }
    

    
//    const contextvalue = {getTotalCartItems,getTotalCartAmount, all_product ,cartItem,addToCart,removeFromCart}
//     return (
//         <ShopContext.Provider value={contextvalue}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }

// export default ShopContextProvider;

"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import all_product from "@/components/Assets/all_product";

// ✅ Define product type
export interface Product {
  id: number;
  name: string;
  new_price: number;
  old_price?: number;
  [key: string]: any;
}

// ✅ Define context type
interface ShopContextType {
  all_product: Product[];
  cartItem: Record<number, number>;
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  getTotalCartItems: () => number;
  getTotalCartAmount: () => number;
}

export const ShopContext = createContext<ShopContextType | null>(null);

// ✅ Hook to use the context easily
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopContextProvider");
  return context;
};

// ✅ Default cart setup
const getDefaultCart = () => {
  let cart: Record<number, number> = {};
  for (let index = 0; index < all_product.length + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};

// ✅ Provider component
const ShopContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItem, setCartItems] = useState<Record<number, number>>(getDefaultCart());

  const addToCart = (itemId: number) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        const itemInfo = all_product.find((p) => p.id === Number(item));
        if (itemInfo) totalAmount += itemInfo.new_price * cartItem[item];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItem).reduce((acc, val) => acc + (val > 0 ? val : 0), 0);
  };

  const value: ShopContextType = {
    all_product,
    cartItem,
    addToCart,
    removeFromCart,
    getTotalCartItems,
    getTotalCartAmount,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
