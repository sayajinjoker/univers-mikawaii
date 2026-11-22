"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CreditCard, Minus, Pencil, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { DELIVERY_OPTIONS, getDeliveryOption, type DeliveryMethod } from "@/lib/delivery";

interface CheckoutResponse {
  checkoutUrl?: string;
  error?: string;
}

export default function PanierPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [acceptedSalesPolicy, setAcceptedSalesPolicy] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);

  const delivery = getDeliveryOption(deliveryMethod);
  const shipping = totalItems > 0 ? (delivery?.price ?? 0) : 0;
  const total = totalPrice + shipping;

  const handleCheckout = async () => {
    if (items.length === 0 || isLoadingCheckout || !acceptedSalesPolicy) return;
    if (!deliveryMethod) {
      window.alert("Veuillez choisir un mode de livraison.");
      return;
    }

    try {
      setIsLoadingCheckout(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            customization: item.customization,
          })),
          acceptedSalesPolicy,
          deliveryMethod,
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Impossible de lancer le paiement Stripe.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      window.alert(message);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffaf6] via-[#fff1ee] to-[#fef6ff] text-[#4a3b47]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d96b7d] hover:text-[#c95067]">
          <ArrowLeft size={18} />
          Continuer mes achats
        </Link>
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-[#f7d9d4]">
          <ShoppingBag size={18} className="text-[#f28b7d]" />
          <span className="font-semibold">{totalItems} article{totalItems > 1 ? "s" : ""}</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 pb-16 lg:grid-cols-[1.5fr_0.9fr]">
        <section className="rounded-[30px] bg-white/90 p-6 shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-[#f8d8d0] md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#4a3b47] md:text-4xl">Mon panier</h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-2 rounded-full border border-[#f5d3d0] bg-[#fff4f3] px-4 py-2 text-sm font-semibold text-[#d36b6c] transition hover:border-[#f0c0bc] hover:bg-[#fff0ef]"
              >
                <Trash2 size={16} />
                Vider
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#f8d8d0] bg-[#fff4f3] px-6 text-center">
              <div className="mb-4 rounded-full bg-white p-4 text-[#f28b7d] shadow-sm ring-1 ring-[#f7d7d2]">
                <ShoppingBag size={28} />
              </div>
              <h2 className="text-2xl font-bold text-[#4a3b47]">Votre panier est vide</h2>
              <p className="mt-3 max-w-md text-gray-600">
                Ajoutez quelques petites merveilles de la boutique pour commencer votre commande.
              </p>
              <Link
                href="/boutique"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-pink-600"
              >
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <article key={item.id} className="flex max-w-full flex-col gap-4 overflow-hidden rounded-2xl border border-[#f7d9d0] bg-[#fffaf8] p-4 md:flex-row md:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>

                  <div className="w-full min-w-0 flex-1">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <h2 className="max-w-full break-words text-xl font-bold">{item.name}</h2>
                        <p className="text-sm text-gray-600">{item.price.toFixed(2)} $ l&apos;unité</p>
                      </div>
                      <div className="flex items-center gap-2 self-start">
                        <Link
                          href={`/personnaliser/${item.id}?itemKey=${encodeURIComponent(item.key)}`}
                          className="inline-flex items-center gap-2 rounded-full border border-[#f7c7c0] bg-white px-3 py-1.5 text-sm font-semibold text-[#d96b7d] transition hover:bg-[#fff5f4]"
                        >
                          <Pencil size={14} />
                          Modifier
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#f7c7c0] bg-[#fff1f0] px-3 py-1.5 text-sm font-semibold text-[#d66563] transition hover:bg-[#ffeae8]"
                        >
                          <Trash2 size={14} />
                          Retirer
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-full border border-[#f4d0c9] bg-white p-1 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#d96b7d] transition hover:bg-[#fff1f0]"
                          aria-label={`Retirer 1 ${item.name}`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="min-w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#d96b7d] transition hover:bg-[#fff1f0]"
                          aria-label={`Ajouter 1 ${item.name}`}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <span className="text-lg font-black text-[#d96b7d]">
                        {(item.price * item.quantity).toFixed(2)} $
                      </span>
                    </div>

                    {item.customization && (
                      <div className="mt-4 w-full min-w-0 overflow-hidden rounded-2xl bg-[#fff7f6] p-3 text-sm text-[#5f4d5d] ring-1 ring-[#f6d4ce]">
                        {item.customization.recipientName && (
                          <p className="mb-2 w-full min-w-0 break-words text-sm font-semibold text-[#4a3b47]">
                            🎁 Pour : {item.customization.recipientName}
                          </p>
                        )}
                        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-[#4a3b47]">
                          <span className="min-w-0 break-words">Scoop : {item.customization.scoopCount}</span>
                          {item.customization.scoopCount === 2 && <span className="shrink-0 rounded-full bg-[#ffe1d6] px-2 py-0.5 text-xs font-bold text-[#c96c72]">+20$</span>}
                        </div>

                        <div className="mt-2 flex w-full min-w-0 flex-wrap gap-2">
                          <span className="min-w-0 break-words rounded-full bg-[#fff0bc] px-2 py-0.5 text-xs font-bold text-[#8a6d00]">
                            Étoile surprise : {item.customization.surpriseStar ? `Oui (+5$)` : "Non"}
                          </span>
                          <span className="min-w-0 break-words rounded-full bg-[#eedcff] px-2 py-0.5 text-xs font-bold text-[#6c50a6]">
                            Vidéo réseaux : {item.customization.socialMediaVideo ? "Oui" : "Non"}
                          </span>
                        </div>

                        {item.customization.notes && (
                          <p className="mt-3 w-full min-w-0 overflow-hidden rounded-xl bg-white/70 p-2 text-sm leading-6 text-[#5f4d5d] break-all whitespace-normal" style={{ overflowWrap: "anywhere" }}>
                            <span className="font-semibold text-[#4a3b47]">Préférences :</span> {item.customization.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-[30px] border border-[#f7d9d4] bg-gradient-to-br from-[#fff9f5] via-[#fff5f7] to-[#fff0ef] p-6 text-[#4a3b47] shadow-[0_25px_50px_rgba(247,170,160,0.18)] md:p-8">
          <div className="inline-flex items-center rounded-full bg-[#ffe4df] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#d67568]">
            Résumé
          </div>
          <h2 className="mt-3 text-3xl font-black text-[#4a3b47]">Commande</h2>

          <div className="mt-8 space-y-4 rounded-2xl bg-white/80 p-4 shadow-inner shadow-[#f9d7d4]">
            <div className="flex items-center justify-between text-sm text-[#5f4d5d]">
              <span>Sous-total</span>
              <span className="font-semibold">{totalPrice.toFixed(2)} $</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-[#5f4d5d]">
              <span>Livraison{delivery ? ` — ${delivery.label}` : ""}</span>
              <span className="shrink-0 font-semibold">{shipping.toFixed(2)} $</span>
            </div>
            <div className="my-2 h-px bg-gradient-to-r from-[#f7c7b8] via-[#f9d7d4] to-transparent" />
            <div className="flex items-center justify-between text-lg font-black text-[#4a3b47]">
              <span>Total</span>
              <span className="text-[#e67d7a]">{total.toFixed(2)} $</span>
            </div>
          </div>

          {items.length > 0 ? (
            <>
              <fieldset className="mt-8 rounded-2xl bg-white/80 p-4 ring-1 ring-[#f4d0c9]">
                <legend className="sr-only">Choisissez votre livraison</legend>
                <p className="mb-3 text-sm font-bold text-[#4a3b47]">Choisissez votre livraison</p>
                <div className="space-y-3">
                  {DELIVERY_OPTIONS.map((option) => (
                    <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#f4d0c9] bg-white p-3 transition hover:bg-pink-50">
                      <input
                        type="checkbox"
                        checked={deliveryMethod === option.id}
                        onChange={() => setDeliveryMethod(option.id)}
                        className="mt-1 h-4 w-4 accent-pink-500"
                      />
                      <span className="min-w-0">
                        <span className="block font-bold text-[#4a3b47]">{option.label}</span>
                        <span className="mt-0.5 block text-sm font-bold text-[#d96b7d]">— {option.price === 0 ? "Gratuit" : `${option.price.toFixed(2)} $`}</span>
                        <span className="mt-1 block text-xs leading-5 text-gray-600">{option.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-white/80 p-4 text-sm leading-6 ring-1 ring-[#f4d0c9]">
                <input
                  type="checkbox"
                  checked={acceptedSalesPolicy}
                  onChange={(event) => setAcceptedSalesPolicy(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-pink-500"
                />
                <span>
                  Je comprends que les articles surprises sont choisis aléatoirement et j’accepte la{" "}
                  <Link href="/politique-vente" target="_blank" className="font-bold text-[#c95067] underline underline-offset-2">
                    politique de vente finale
                  </Link>
                  . Aucun remboursement, retour, échange ou annulation n’est offert, sous réserve des droits obligatoires prévus par la loi.
                </span>
              </label>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoadingCheckout || !acceptedSalesPolicy || !deliveryMethod}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f38fa4] via-[#f5a88a] to-[#efc86e] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#f4bbaf]/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f4bbaf]/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <CreditCard size={18} />
                {isLoadingCheckout ? "Redirection..." : "Payer maintenant"}
              </button>
            </>
          ) : (
            <Link
              href="/boutique"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f38fa4] via-[#f5a88a] to-[#efc86e] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#f4bbaf]/60 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f4bbaf]/70"
            >
              Découvrir les produits
            </Link>
          )}
        </aside>
      </main>
    </div>
  );
}
