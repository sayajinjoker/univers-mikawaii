"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { CART_STORAGE_KEY, buildItemKey, useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/products";

export default function ProductCustomizerPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const productId = Number(params.id);
  const product = getProductById(productId);
  const router = useRouter();
  const { items, addToCart, updateItem } = useCart();
  const editKey = searchParams.get("itemKey");

  const [scoopCount, setScoopCount] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [surpriseStar, setSurpriseStar] = useState<boolean | null>(null);
  const [socialMediaVideo, setSocialMediaVideo] = useState<boolean | null>(null);

  useEffect(() => {
    if (!editKey) return;

    const item = items.find((entry) => entry.key === editKey);
    if (!item?.customization) return;

    setScoopCount(item.customization.scoopCount ?? 1);
    setNotes(item.customization.notes ?? "");
    setRecipientName(item.customization.recipientName ?? "");
    setSurpriseStar(item.customization.surpriseStar ?? false);
    setSocialMediaVideo(item.customization.socialMediaVideo ?? false);
  }, [editKey, items]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price + (scoopCount === 2 ? 20 : 0);
    if (surpriseStar) total += 5;
    return total;
  }, [product, scoopCount, surpriseStar]);

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf8] p-6 text-center text-[#4a3b47]">
        <div>
          <p className="text-lg font-semibold">Produit introuvable.</p>
          <Link href="/boutique" className="mt-4 inline-block rounded-full bg-pink-500 px-5 py-3 font-semibold text-white">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = () => {
    const customization = {
      scoopCount,
      notes,
      recipientName,
      surpriseStar: Boolean(surpriseStar),
      socialMediaVideo: Boolean(socialMediaVideo),
    };

    const nextItem = {
      ...product,
      price: finalPrice,
      customization,
      key: buildItemKey(product, customization),
      quantity: 1,
    };

    if (editKey) {
      const existingItem = items.find((item) => item.key === editKey);
      if (existingItem) {
        updateItem(editKey, {
          ...existingItem,
          ...nextItem,
          quantity: existingItem.quantity,
          price: finalPrice,
          customization,
          key: buildItemKey(product, customization),
        });
      }
    } else {
      addToCart({
        ...product,
        price: finalPrice,
        customization,
      });
    }

    router.push("/panier");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fff0f5] to-[#fdf7ff] px-6 py-10 text-[#4a3b47]">
      <div className="mx-auto w-full max-w-7xl">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d96b7d] hover:text-[#c95067]">
          <ArrowLeft size={18} />
          Retour à la boutique
        </Link>

        <div className="mt-8 grid w-full gap-8 rounded-[32px] bg-white/80 p-6 shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100 md:grid-cols-[1.15fr_1fr] md:p-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          <div className="min-w-0 overflow-hidden rounded-[28px] bg-gradient-to-br from-pink-50 to-purple-50 p-3">
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[22px] bg-white md:min-h-[520px]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

        <div className="min-w-0 w-full">
            <div className="mb-3 inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
              Personnalisation
            </div>
            <h1 className="max-w-full break-words text-3xl font-black md:text-4xl">{product.name}</h1>
            <p className="mt-3 max-w-full break-words text-lg text-gray-600">{product.description}</p>

            <div className="mt-6 max-w-full overflow-hidden rounded-2xl bg-[#fff7f6] p-4 ring-1 ring-[#f8d2ce]">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#d96b7d]">Choix de scoop</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[1, 2].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScoopCount(option)}
                    className={`max-w-full rounded-2xl border px-4 py-3 text-left transition ${
                      scoopCount === option
                        ? "border-pink-300 bg-pink-500 text-white shadow-lg shadow-pink-200"
                        : "border-pink-200 bg-white text-[#4a3b47] hover:bg-pink-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">{option} scoop{option > 1 ? "s" : ""}</span>
                      {option === 2 && <span className="text-xs font-semibold">+20$</span>}
                    </div>
                    <p className={`mt-1 block max-w-full break-all text-sm ${scoopCount === option ? "text-pink-50" : "text-gray-600"}`}>
                      {option === 1
                        ? "Une surprise ciblée."
                        : "Mini boîte : petites scoops kawaii, moment magique."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold uppercase tracking-[0.16em] text-[#d96b7d]">
                À qui est destiné ce colis?
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
                placeholder="Ex: Emma, Marie-Claude, Jean-Philippe…"
                className="mt-3 w-full max-w-full rounded-2xl border border-[#f4d0c9] bg-white px-4 py-3 text-[#4a3b47] outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />
              <p className="mt-2 text-xs text-gray-500">
                Le nom de la personne destinataire de cette boîte (peut être différent de l&apos;adresse de livraison).
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold uppercase tracking-[0.16em] text-[#d96b7d]">
                Préférences
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ex: métier, couleurs préférées, occupation, thèmes à éviter…"
                className="mt-3 min-h-[130px] w-full max-w-full resize-none rounded-2xl border border-[#f4d0c9] bg-white px-4 py-3 text-[#4a3b47] outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <div className="mt-6 max-w-full overflow-hidden rounded-2xl border border-[#f4d0c9] bg-[#fffaf8] p-4">
              <p className="max-w-full break-words text-sm font-bold uppercase tracking-[0.16em] text-[#d96b7d]">Étoile surprise</p>
              <p className="mt-1 max-w-full break-words text-sm text-gray-600">Ajoutez une petite surprise en bonus (+5$).</p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setSurpriseStar(value)}
                    className={`inline-flex max-w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                      surpriseStar === value
                        ? "bg-amber-100 text-amber-600 ring-1 ring-amber-200"
                        : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                    }`}
                  >
                    {value ? <Star size={16} className="fill-current" /> : <Sparkles size={16} />}
                    {value ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 max-w-full overflow-hidden rounded-2xl border border-[#f4d0c9] bg-[#fffaf8] p-4">
              <p className="max-w-full break-words text-sm font-bold uppercase tracking-[0.16em] text-[#d96b7d]">Vidéo pour nos médias sociaux</p>
              <p className="mt-1 max-w-full break-words text-sm text-gray-600">Acceptez que votre boîte soit filmée pour nos réseaux.</p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {[true, false].map((value) => (
                  <button
                    key={`video-${String(value)}`}
                    type="button"
                    onClick={() => setSocialMediaVideo(value)}
                    className={`max-w-full rounded-full px-4 py-2 text-sm font-bold transition ${
                      socialMediaVideo === value
                        ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                        : "bg-white text-[#4a3b47] ring-1 ring-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    {value ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl bg-[#4a3b47] p-4 text-white">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-pink-200">Prix</p>
                <p className="mt-1 text-3xl font-black">{finalPrice.toFixed(2)} $</p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-[#f6b76c] px-6 py-3 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
