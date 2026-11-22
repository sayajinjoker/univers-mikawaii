import Link from "next/link";
import { CircleX } from "lucide-react";

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf8] via-[#fff1f4] to-[#fdf7ff] px-6 text-[#4a3b47]">
      <section className="w-full max-w-xl rounded-[28px] bg-white/90 p-8 text-center shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <CircleX size={30} />
        </div>

        <h1 className="mt-5 text-3xl font-black">Paiement annule</h1>
        <p className="mt-3 text-gray-600">
          Votre commande est toujours dans le panier. Vous pouvez reprendre le paiement quand vous voulez.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/panier"
            className="rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
          >
            Retour au panier
          </Link>
          <Link
            href="/boutique"
            className="rounded-full border border-pink-200 bg-white px-6 py-3 font-semibold text-[#d96b7d] transition hover:bg-pink-50"
          >
            Continuer mes achats
          </Link>
        </div>
      </section>
    </main>
  );
}

