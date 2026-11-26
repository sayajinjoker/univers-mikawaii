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
  const [audience, setAudience] = useState<"child" | "adult" | null>(null);
  const [hoveredAudience, setHoveredAudience] = useState<"child" | "adult" | null>(null);
  const [surpriseStar, setSurpriseStar] = useState<boolean | null>(null);
  const [socialMediaVideo, setSocialMediaVideo] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!editKey) return;

    const item = items.find((entry) => entry.key === editKey);
    if (!item?.customization) return;

    setScoopCount(item.customization.scoopCount ?? 1);
    setNotes(item.customization.notes ?? "");
    setRecipientName(item.customization.recipientName ?? "");
    setAudience(item.customization.audience ?? "adult");
    setSurpriseStar(item.customization.surpriseStar ?? false);
    setSocialMediaVideo(item.customization.socialMediaVideo ?? false);
  }, [editKey, items]);

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.price + (scoopCount === 2 ? product.secondScoopUpgrade : 0);
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
    if (!recipientName.trim()) {
      setValidationMessage("Indiquez à qui est destinée la boîte avant de continuer.");
      return;
    }

    if (!audience) {
      setValidationMessage("Choisissez Enfant ou Adulte pour personnaliser les surprises.");
      return;
    }

    if (surpriseStar === null) {
      setValidationMessage("Choisissez Oui ou Non pour l’étoile surprise.");
      return;
    }

    if (socialMediaVideo === null) {
      setValidationMessage("Choisissez Oui ou Non pour la vidéo sur les réseaux sociaux.");
      return;
    }

    setValidationMessage(null);

    const customization = {
      scoopCount,
      notes,
      recipientName: recipientName.trim(),
      audience,
      surpriseStar,
      socialMediaVideo,
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
    <main className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fff0f5] to-[#fdf7ff] px-4 py-4 text-[#4a3b47] md:py-6">
      <div className="mx-auto w-full max-w-7xl">
        <Link href="/boutique" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d96b7d] hover:text-[#c95067]">
          <ArrowLeft size={16} />
          Retour à la boutique
        </Link>

        <div className="mt-4 grid w-full gap-4 rounded-[24px] bg-white/80 p-4 shadow-[0_20px_40px_rgba(247,190,180,0.16)] ring-1 ring-pink-100 md:grid-cols-[1fr_1.15fr] md:p-5 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
          <div className="min-w-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-pink-50 to-purple-50 p-2">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-[18px] bg-white md:min-h-[390px]">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="min-w-0 w-full">
            <div className="mb-2 inline-flex items-center rounded-full bg-pink-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-pink-600">
              Personnalisation
            </div>
            <h1 className="max-w-full break-words text-2xl font-black md:text-3xl">{product.name}</h1>
            <p className="mt-1.5 max-w-full break-words text-sm leading-5 text-gray-600">{product.description}</p>

            <div className="mt-4 max-w-full overflow-hidden rounded-xl bg-[#fff7f6] p-3 ring-1 ring-[#f8d2ce]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d96b7d]">Choix de scoop</p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {[1, 2].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setScoopCount(option)}
                    className={`max-w-full rounded-xl border px-3 py-2 text-left transition ${
                      scoopCount === option
                        ? "border-pink-300 bg-pink-500 text-white shadow-md shadow-pink-200"
                        : "border-pink-200 bg-white text-[#4a3b47] hover:bg-pink-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{option} scoop{option > 1 ? "s" : ""}</span>
                      {option === 2 && <span className="text-[11px] font-semibold">+{product.secondScoopUpgrade}$</span>}
                    </div>
                    <p className={`mt-0.5 block max-w-full break-words text-xs leading-4 ${scoopCount === option ? "text-pink-50" : "text-gray-600"}`}>
                      {product.articlesPerScoop[option - 1]} articles
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#d96b7d]">
                À qui est destiné ce colis?
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
                placeholder="Ex: Emma, Marie-Claude, Jean-Philippe…"
                className="mt-2 w-full max-w-full rounded-xl border border-[#f4d0c9] bg-white px-3 py-2 text-sm text-[#4a3b47] outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              />
              <p className="mt-1 text-[11px] leading-4 text-gray-500">
                Le nom peut être différent de celui de l’adresse de livraison.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#d96b7d]">
                Pour qui est cette boîte?
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {([
                  { value: "child" as const, label: "Enfant" },
                  { value: "adult" as const, label: "Adulte" },
                ]).map((option) => (
                  <label
                    key={option.value}
                    onMouseEnter={() => {
                      if (!audience) setHoveredAudience(option.value);
                    }}
                    onMouseLeave={() => setHoveredAudience(null)}
                    onFocus={() => {
                      if (!audience) setHoveredAudience(option.value);
                    }}
                    onBlur={() => setHoveredAudience(null)}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      audience === option.value
                        ? "border-pink-300 bg-pink-50 text-pink-600 ring-1 ring-pink-200"
                        : "border-[#f4d0c9] bg-white text-[#4a3b47] hover:bg-pink-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={audience === option.value}
                      onChange={() => {
                        setAudience(option.value);
                        setHoveredAudience(null);
                      }}
                      className="h-4 w-4 accent-pink-500"
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              {(hoveredAudience || audience) && (
                <div
                  aria-live="polite"
                  className={`mt-2 min-h-[180px] rounded-xl border p-3 text-left ${
                    (hoveredAudience || audience) === "child"
                      ? "border-amber-200 bg-amber-50"
                      : "border-purple-200 bg-purple-50"
                  }`}
                >
                  {(hoveredAudience || audience) === "child" ? (
                    <>
                      <p className="text-sm font-black text-[#4a3b47]">Collection Enfants — 3 à 10 ans</p>
                      <p className="mt-1 text-xs leading-5 text-gray-700">
                        Un assortiment de petites surprises colorées et amusantes, spécialement sélectionnées pour les enfants!
                      </p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-amber-800">
                        ⚠️ Attention : risque d’étouffement. Certains articles contiennent de petites pièces. Ne convient pas aux enfants de moins de 3 ans. La surveillance d’un adulte est recommandée.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-black text-[#4a3b47]">Collection Ados et adultes — 11 ans et plus</p>
                      <p className="mt-1 text-xs leading-5 text-gray-700">
                        Des surprises mignonnes et tendance pour les plus grands! Papeterie, accessoires et petites découvertes kawaii, dans un style moins enfantin, mais toujours rempli de douceur.
                      </p>
                    </>
                  )}
                </div>
              )}
              <p className="mt-1 text-[11px] leading-4 text-gray-500">
                Ce choix permet d’adapter les surprises au public prévu.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-[0.14em] text-[#d96b7d]">
                Préférences
              </label>
              <textarea
                value={notes}
                maxLength={280}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ex: métier, couleurs préférées, occupation, thèmes à éviter…"
                className="mt-2 min-h-[76px] w-full max-w-full resize-y rounded-xl border border-[#f4d0c9] bg-white px-3 py-2 text-sm text-[#4a3b47] outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div className="mt-4 max-w-full overflow-hidden rounded-xl border border-[#f4d0c9] bg-[#fffaf8] p-3">
              <p className="max-w-full break-words text-xs font-bold uppercase tracking-[0.14em] text-[#d96b7d]">Étoile surprise</p>
              <p className="mt-0.5 max-w-full break-words text-xs leading-4 text-gray-600">Petite surprise en bonus (+5$).</p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setSurpriseStar(value)}
                    className={`inline-flex max-w-full items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      surpriseStar === value
                        ? "bg-amber-100 text-amber-600 ring-1 ring-amber-200"
                        : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                    }`}
                  >
                    {value ? <Star size={14} className="fill-current" /> : <Sparkles size={14} />}
                    {value ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 max-w-full overflow-hidden rounded-xl border border-[#f4d0c9] bg-[#fffaf8] p-3">
              <p className="max-w-full break-words text-xs font-bold uppercase tracking-[0.14em] text-[#d96b7d]">Vidéo pour nos médias sociaux</p>
              <p className="mt-0.5 max-w-full break-words text-xs leading-4 text-gray-600">Acceptez que votre boîte soit filmée pour nos réseaux.</p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {[true, false].map((value) => (
                  <button
                    key={`video-${String(value)}`}
                    type="button"
                    onClick={() => setSocialMediaVideo(value)}
                    className={`max-w-full rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      socialMediaVideo === value
                        ? "bg-pink-500 text-white shadow-sm shadow-pink-200"
                        : "bg-white text-[#4a3b47] ring-1 ring-pink-200 hover:bg-pink-50"
                    }`}
                  >
                    {value ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#4a3b47] p-3 text-white">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-pink-200">Prix</p>
                <p className="mt-0.5 text-2xl font-black">{finalPrice.toFixed(2)} $</p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-[#f6b76c] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>

      {validationMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a3b47]/45 px-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customization-validation-title"
          onClick={() => setValidationMessage(null)}
        >
          <div
            className="w-full max-w-sm rounded-[28px] border border-pink-100 bg-white p-6 text-center shadow-[0_24px_70px_rgba(74,59,71,0.3)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
              <Sparkles size={24} />
            </div>
            <h2 id="customization-validation-title" className="mt-4 text-xl font-black text-[#4a3b47]">
              Presque terminé!
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{validationMessage}</p>
            <button
              type="button"
              autoFocus
              onClick={() => setValidationMessage(null)}
              className="mt-5 w-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-[#f6b76c] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-200 transition hover:-translate-y-0.5"
            >
              Continuer la personnalisation
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
