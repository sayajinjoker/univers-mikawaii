"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  const handleAddToCart = () => {
    router.push(`/personnaliser/${product.id}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition hover:shadow-xl">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-100 opacity-50 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-purple-100 opacity-50 blur-2xl" />

      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-purple-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition group-hover:scale-110"
        />
      </div>

      <div className="relative">
        <h3 className="text-xl font-bold text-[#4a3b47]">{product.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-pink-500">
            {product.price.toFixed(2)} $
          </span>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-1 hover:bg-pink-600"
          >
            <ShoppingCart size={18} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
