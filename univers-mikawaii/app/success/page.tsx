import Link from "next/link";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { ClearCartOnLoad } from "@/components/shop/ClearCartOnLoad";
import { getStripeServer } from "@/lib/stripe-server";

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let paymentConfirmed = false;

  if (sessionId) {
    try {
      const stripe = getStripeServer();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paymentConfirmed = session.payment_status === "paid" || session.status === "complete";
    } catch {
      paymentConfirmed = false;
    }
  }

  const title = paymentConfirmed ? "Paiement reussi" : "Paiement en attente";
  const description = paymentConfirmed
    ? "Merci pour votre commande. Vous recevrez une confirmation des details de paiement par Stripe."
    : "Nous n'avons pas encore pu confirmer ce paiement. Si vous avez ete debite, patientez quelques instants puis rechargez cette page.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffaf8] via-[#fff1f4] to-[#fdf7ff] px-6 text-[#4a3b47]">
      <section className="w-full max-w-xl rounded-[28px] bg-white/90 p-8 text-center shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100">
        {paymentConfirmed ? <ClearCartOnLoad /> : null}

        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${paymentConfirmed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
          {paymentConfirmed ? <CheckCircle2 size={30} /> : <CircleAlert size={30} />}
        </div>

        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-3 text-gray-600">{description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/boutique"
            className="rounded-full bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
          >
            Retour a la boutique
          </Link>
          <Link
            href="/"
            className="rounded-full border border-pink-200 bg-white px-6 py-3 font-semibold text-[#d96b7d] transition hover:bg-pink-50"
          >
            Aller a l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}



