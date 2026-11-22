"use client";

import { useEffect } from "react";
import { CART_STORAGE_KEY, useCart } from "@/lib/cart-context";

export function ClearCartOnLoad() {
  const { clearCart } = useCart();

  useEffect(() => {
    window.sessionStorage.removeItem(CART_STORAGE_KEY);
    clearCart();
  }, [clearCart]);

  return null;
}

