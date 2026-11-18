"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="relative w-full overflow-hidden bg-gradient-to-r from-[#FF9ECF] via-[#D8C7FF] to-[#FFD98E]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🌸</span>
          <span className="text-xl font-extrabold text-[#4A3B47] md:text-2xl">
            Univers Mikawaii
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="cursor-pointer text-[#4A3B47] hover:text-pink-500">
            Accueil
          </Link>
          <Link href="/boutique" className="cursor-pointer text-[#4A3B47] hover:text-pink-500">
            Boutique
          </Link>
          <Link href="/a-propos" className="cursor-pointer text-[#4A3B47] hover:text-pink-500">
            À propos
          </Link>
        </div>

        <Link
          href="/panier"
          className="relative rounded-full bg-white/60 p-3 text-pink-500 shadow-sm backdrop-blur transition hover:scale-110"
          aria-label="Voir mon panier"
        >
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}