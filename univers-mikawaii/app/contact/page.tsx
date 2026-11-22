"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Mail, Send } from "lucide-react";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          orderNumber: data.get("orderNumber"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error || "Impossible d’envoyer le message.");

      form.reset();
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible d’envoyer le message.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fff0f5] to-[#fdf7ff] px-6 py-12 text-[#4a3b47]">
      <div className="mx-auto max-w-3xl">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d96b7d] hover:text-[#c95067]">
          <ArrowLeft size={18} />
          Retour à la boutique
        </Link>

        <div className="mt-8 overflow-hidden rounded-[32px] bg-white/90 shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100">
          <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-amber-200 p-8 text-center">
            <Mail className="mx-auto text-[#6b3f67]" size={34} />
            <h1 className="mt-3 text-3xl font-black md:text-4xl">Contactez-nous</h1>
            <p className="mt-2 text-[#5e5060]">Une question sur une boîte, une commande ou la livraison?</p>
          </div>

          <div className="p-6 md:p-10">
            <p className="text-sm leading-6 text-gray-600">
              Complétez le formulaire. Votre message sera envoyé directement à{" "}
              <a href="mailto:univers.mikawaii@hotmail.com" className="font-semibold text-pink-600 underline underline-offset-2">
                univers.mikawaii@hotmail.com
              </a>.
            </p>

            {status === "sent" && (
              <div role="status" className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
                Votre message a bien été envoyé. Nous vous répondrons dès que possible.
              </div>
            )}
            {status === "error" && (
              <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-bold">
                  Nom
                  <input name="name" required maxLength={100} autoComplete="name" className="mt-2 w-full rounded-2xl border border-[#f4d0c9] px-4 py-3 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100" />
                </label>
                <label className="text-sm font-bold">
                  Courriel
                  <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 w-full rounded-2xl border border-[#f4d0c9] px-4 py-3 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100" />
                </label>
              </div>

              <label className="block text-sm font-bold">
                Numéro de commande <span className="font-normal text-gray-500">(facultatif)</span>
                <input name="orderNumber" maxLength={100} placeholder="Ex.: 49e06655-..." className="mt-2 w-full rounded-2xl border border-[#f4d0c9] px-4 py-3 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100" />
              </label>

              <label className="block text-sm font-bold">
                Message
                <textarea name="message" required minLength={10} maxLength={3000} rows={7} className="mt-2 w-full resize-y rounded-2xl border border-[#f4d0c9] px-4 py-3 font-normal outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100" placeholder="Décrivez votre question ou le problème rencontré…" />
              </label>

              <label className="hidden" aria-hidden="true">
                Site Web
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>

              <button type="submit" disabled={status === "sending"} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3.5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                <Send size={18} />
                {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

