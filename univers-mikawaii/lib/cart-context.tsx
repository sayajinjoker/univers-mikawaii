"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartCustomization {
  scoopCount: number;
  notes: string;
  surpriseStar: boolean;
  socialMediaVideo: boolean;
  recipientName: string;
}

export interface CartItem extends Product {
  quantity: number;
  key: string;
  customization?: CartCustomization;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product & { quantity?: number; customization?: CartCustomization }) => void;
  updateItem: (oldKey: string, nextItem: CartItem) => void;
  removeFromCart: (itemKey: string) => void;
  updateQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CART_STORAGE_KEY = "univers-mikawaii-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function buildItemKey(product: Product, customization?: CartCustomization) {
  const serialized = JSON.stringify(customization ?? null);
  return `${product.id}-${serialized}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCart = window.sessionStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return;

    try {
      const parsedCart = JSON.parse(savedCart) as CartItem[];
      if (Array.isArray(parsedCart)) {
        setItems(parsedCart);
      }
    } catch {
      window.sessionStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (items.length === 0) {
      window.sessionStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product & { quantity?: number; customization?: CartCustomization }) => {
    setItems((prevItems) => {
      const quantity = product.quantity ?? 1;
      const customKey = buildItemKey(product, product.customization);
      const existingItem = prevItems.find((item) => item.key === customKey);

      if (existingItem) {
        return prevItems.map((item) =>
          item.key === customKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity,
          key: customKey,
          customization: product.customization,
        },
      ];
    });
  }, []);

  const updateItem = useCallback((oldKey: string, nextItem: CartItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.key === oldKey ? nextItem : item))
    );
  }, []);

  const removeFromCart = useCallback((itemKey: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== itemKey));
  }, []);

  const updateQuantity = useCallback((itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.key === itemKey ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems((prevItems) => (prevItems.length === 0 ? prevItems : []));
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
