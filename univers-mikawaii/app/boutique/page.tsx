"use client";

import ProductCard from "@/components/shop/ProductCard";
import { products } from "@/lib/products";

export default function Boutique() {
  return (
    <div className="flex min-h-full flex-col overflow-x-hidden">
      <main className="flex-1 bg-[#fff9f5] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-[#4a3b47] md:text-5xl">
              Notre Boutique
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez nos boîtes surprises MiKawaii soigneusement sélectionnées
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
