import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type ProductMeta = {
  id: string;
  favorite?: boolean;
  viewedCount?: number;
  lastViewedAt?: number;
  // any other per-product small UI flags
  [k: string]: any;
};

type ProductStateContextType = {
  metas: Record<string, ProductMeta>;
  toggleFavorite: (productId: string) => void;
  markViewed: (productId: string) => void;
  setMeta: (productId: string, patch: Partial<ProductMeta>) => void;
  getMeta: (productId: string) => ProductMeta | undefined;
  clearAll: () => void;
};

const PROD_LS_KEY = "krishishetr_product_meta_v1";
const ProductStateContext = createContext<ProductStateContextType | undefined>(undefined);

export const ProductStateProvider = ({ children }: { children: ReactNode }) => {
  const [metas, setMetas] = useState<Record<string, ProductMeta>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(PROD_LS_KEY);
      if (raw) setMetas(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load product metas", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(PROD_LS_KEY, JSON.stringify(metas));
    } catch (e) {
      console.warn("Failed to save product metas", e);
    }
  }, [metas]);

  const toggleFavorite = (productId: string) => {
    setMetas((prev) => {
      const cur = prev[productId] ?? { id: productId, favorite: false, viewedCount: 0 };
      return {
        ...prev,
        [productId]: { ...cur, favorite: !cur.favorite },
      };
    });
  };

  const markViewed = (productId: string) => {
    setMetas((prev) => {
      const cur = prev[productId] ?? { id: productId, favorite: false, viewedCount: 0 };
      return {
        ...prev,
        [productId]: { ...cur, viewedCount: (cur.viewedCount ?? 0) + 1, lastViewedAt: Date.now() },
      };
    });
  };

  const setMeta = (productId: string, patch: Partial<ProductMeta>) => {
    setMetas((prev) => {
      const cur = prev[productId] ?? { id: productId };
      return { ...prev, [productId]: { ...cur, ...patch } };
    });
  };

  const getMeta = (productId: string) => metas[productId];

  const clearAll = () => setMetas({});

  return (
    <ProductStateContext.Provider value={{ metas, toggleFavorite, markViewed, setMeta, getMeta, clearAll }}>
      {children}
    </ProductStateContext.Provider>
  );
};

export const useProductState = () => {
  const ctx = useContext(ProductStateContext);
  if (!ctx) throw new Error("useProductState must be used within ProductStateProvider");
  return ctx;
};
