import React, { createContext, useContext, useEffect, useState } from 'react';
import { Coupon, Product } from '../types';
import { INITIAL_COUPONS, INITIAL_PRODUCTS } from '../data/menuData';

interface MenuContextType {
  products: Product[];
  coupons: Coupon[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
  updatePrice: (id: string, newPrice: number) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  resetToDefaults: () => void;
}

const MENU_STORAGE_KEY = 'crispybite_products_v1';
const COUPON_STORAGE_KEY = 'crispybite_admin_coupons_v1';

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(MENU_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // LocalStorage error handled
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupons));
    } catch {
      // LocalStorage error handled
    }
  }, [coupons]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const updatePrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: Math.max(0, newPrice) } : item
      )
    );
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCoupons(INITIAL_COUPONS);
    localStorage.removeItem(MENU_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  return (
    <MenuContext.Provider
      value={{
        products,
        coupons,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleAvailability,
        updatePrice,
        addCoupon,
        deleteCoupon,
        resetToDefaults,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
