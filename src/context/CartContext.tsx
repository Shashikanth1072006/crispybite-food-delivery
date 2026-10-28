import React, { createContext, useContext, useEffect, useState } from 'react';
import { AddonOption, CartItem, Coupon, Product } from '../types';
import { INITIAL_COUPONS } from '../data/menuData';

interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isCartOpen: boolean;
  activeCoupon: Coupon | null;
  totals: CartTotals;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    quantity?: number,
    spiceLevel?: string,
    selectedAddons?: AddonOption[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  availableCoupons: Coupon[];
  customizingProduct: Product | null;
  setCustomizingProduct: (product: Product | null) => void;
}

const CART_STORAGE_KEY = 'crispybite_cart_v1';
const COUPON_STORAGE_KEY = 'crispybite_coupon_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // LocalStorage error handled
    }
  }, [items]);

  useEffect(() => {
    try {
      if (activeCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(activeCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // LocalStorage error handled
    }
  }, [activeCoupon]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const calculateItemUnitPrice = (
    basePrice: number,
    addons: AddonOption[] = []
  ): number => {
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    return basePrice + addonsTotal;
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    spiceLevel?: string,
    selectedAddons: AddonOption[] = [],
    specialInstructions = ''
  ) => {
    const defaultSpice = spiceLevel || (product.spiceLevels ? product.spiceLevels[0] : undefined);
    const unitPrice = calculateItemUnitPrice(product.price, selectedAddons);
    const totalPrice = unitPrice * quantity;

    // Create unique key based on product ID, spice, and selected addons
    const addonsKey = selectedAddons.map((a) => a.id).sort().join('-');
    const cartItemId = `${product.id}-${defaultSpice || 'def'}-${addonsKey}-${specialInstructions.slice(0, 10)}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: existing.unitPrice * newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          quantity,
          spiceLevel: defaultSpice,
          selectedAddons,
          specialInstructions,
          unitPrice,
          totalPrice,
        };
        return [...prevItems, newItem];
      }
    });

    // Close customize modal if open
    setCustomizingProduct(null);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: item.unitPrice * newQuantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setActiveCoupon(null);
  };

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Delivery fee rules: Free over ₹599, else ₹40 standard delivery
  let baseDeliveryFee = subtotal > 0 ? (subtotal >= 599 ? 0 : 40) : 0;

  // Discount calculation
  let discount = 0;
  if (activeCoupon && subtotal >= activeCoupon.minOrder) {
    if (activeCoupon.code === 'FREESHIP') {
      discount = Math.min(baseDeliveryFee, activeCoupon.maxDiscount);
    } else {
      const calculatedPercent = Math.round((subtotal * activeCoupon.discountPercent) / 100);
      discount = Math.min(calculatedPercent, activeCoupon.maxDiscount);
    }
  }

  // 5% Restaurant GST
  const taxableAmount = Math.max(0, subtotal - (activeCoupon?.code !== 'FREESHIP' ? discount : 0));
  const tax = subtotal > 0 ? Math.round(taxableAmount * 0.05) : 0;

  const total = Math.max(0, subtotal + baseDeliveryFee + tax - discount);

  const totals: CartTotals = {
    subtotal,
    deliveryFee: baseDeliveryFee,
    tax,
    discount,
    total,
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleaned);

    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try CRISPY50 or FEAST100.' };
    }

    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Cart value must be at least ₹${found.minOrder} to apply ${found.code}. Add ₹${found.minOrder - subtotal} more!`,
      };
    }

    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isCartOpen,
        activeCoupon,
        totals,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        availableCoupons: INITIAL_COUPONS,
        customizingProduct,
        setCustomizingProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
