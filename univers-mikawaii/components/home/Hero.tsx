"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fff0f8] px-6 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-pink-200 opacity-40 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-purple-200 opacity-40 blur-3xl" />

        <Image
          src="/images/Logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="object-contain"
          priority
        />

        <h1 className="mt-8 max-w-4xl text-3xl font-bold leading-tight text-[#4a3b47] md:text-5xl">
          Découvrez un univers rempli de
          <span className="text-pink-500"> mignonnerie</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Des boîtes surprises soigneusement sélectionnées, remplies de trésors kawaii et de découvertes uniques.
        </p>

        <Link
          href="/boutique"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-pink-500 px-8 py-4 text-white shadow-lg transition hover:-translate-y-1 hover:bg-pink-600"
        >
          <Gift size={20} />
          Découvrir les boîtes
        </Link>
      </div>
    </section>
  );
}