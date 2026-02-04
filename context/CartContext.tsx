import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

/**
 * Reuse your Product type
 * Make sure this matches the Product shape in your UI file:
 */
export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

export type CartItem = {
  product: Product;
  qty: number;
  addedAt: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getQty: (productId: string) => number;
};

const CART_LS_KEY = "krishishetr_cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // load from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(CART_LS_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch (e) {
      console.warn("Failed to read cart from localStorage", e);
    }
  }, []);

  // persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CART_LS_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const addToCart = (product: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { product, qty, addedAt: Date.now() }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const setQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, qty } : i)));
  };

  const clearCart = () => setItems([]);

  const isInCart = (productId: string) => items.some((i) => i.product.id === productId);

  const getQty = (productId: string) => items.find((i) => i.product.id === productId)?.qty ?? 0;

  const totals = useMemo(() => {
    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const totalAmount = items.reduce((s, i) => s + i.qty * i.product.price, 0);
    return { totalItems, totalAmount };
  }, [items]);

  const value: CartContextType = {
    items,
    totalItems: totals.totalItems,
    totalAmount: totals.totalAmount,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    isInCart,
    getQty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
