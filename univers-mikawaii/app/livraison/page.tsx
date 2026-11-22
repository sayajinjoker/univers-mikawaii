import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Livraison | Univers Mikawaii",
  description: "Frais, adresses, délais indicatifs et suivi des livraisons Univers Mikawaii.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fff0f5] to-[#fdf7ff] px-6 py-12 text-[#4a3b47]">
      <div className="mx-auto max-w-3xl">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d96b7d] hover:text-[#c95067]">
          <ArrowLeft size={18} />
          Retour à la boutique
        </Link>

        <article className="mt-8 rounded-[32px] bg-white/90 p-6 shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-500">Expédition</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Politique de livraison</h1>
          <p className="mt-4 text-sm text-gray-500">Dernière mise à jour : 22 novembre 2026</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-pink-50 p-5 text-center ring-1 ring-pink-100">
              <Package className="mx-auto text-pink-500" size={28} />
              <p className="mt-3 font-bold">Cueillette au Terminus Beauport — Gratuit</p>
              <p className="text-sm text-gray-600">Le moment de remise est confirmé par courriel</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-5 text-center ring-1 ring-purple-100">
              <MapPin className="mx-auto text-purple-500" size={28} />
              <p className="mt-3 font-bold">Mikawaii-Express — 5,00 $</p>
              <p className="text-sm text-gray-600">Limoilou, Beauport et Charlesbourg</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-5 text-center ring-1 ring-amber-100">
              <Mail className="mx-auto text-amber-600" size={28} />
              <p className="mt-3 font-bold">Postes Canada — 6,90 $</p>
              <p className="text-sm text-gray-600">Livraison postale au Canada</p>
            </div>
          </div>

          <div className="mt-9 space-y-7 leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">1. Modes disponibles</h2>
              <p className="mt-2">
                Au panier, le client doit sélectionner une méthode obligatoire :
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li><strong>Cueillette au Terminus Beauport — gratuite.</strong> Le moment exact de remise est confirmé par Univers Mikawaii par courriel.</li>
                <li><strong>Livraison Mikawaii-Express — 5,00 $.</strong> Disponible uniquement dans les secteurs de Limoilou, Beauport et Charlesbourg.</li>
                <li><strong>Postes Canada — 6,90 $.</strong> Expédition postale à une adresse admissible au Canada.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">2. Frais de livraison</h2>
              <p className="mt-2">
                La cueillette n’entraîne aucun frais. Mikawaii-Express coûte <strong>5,00 $ CAD par commande</strong> et
                Postes Canada coûte <strong>6,90 $ CAD par commande</strong>.
                Le montant choisi est recalculé et affiché avant le paiement, puis inscrit dans la confirmation de commande.
              </p>
              <p className="mt-2">
                Mikawaii-Express ne doit être choisi que pour une adresse située à Limoilou, Beauport ou Charlesbourg.
                Une commande utilisant cette option pour une adresse hors secteur doit être corrigée avant la remise.
              </p>
              <p className="mt-2">
                Pour Postes Canada, le service, le délai et le suivi dépendent de l’expédition retenue. Aucun frais post-paiement n’est ajouté au forfait affiché de 6,90 $ sans l’accord du client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">3. Préparation et délai</h2>
              <p className="mt-2">
                Chaque boîte est préparée individuellement et son contenu surprise est choisi selon les préférences
                reçues. Le délai de préparation ou de transport n’est pas garanti tant qu’il n’a pas été confirmé par
                Univers Mikawaii pour votre commande.
              </p>
              <p className="mt-2">
                Les retards du transporteur, les conditions météorologiques, les périodes achalandées, une adresse
                incomplète ou des événements hors de notre contrôle peuvent allonger le délai de livraison.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">4. Destinataire et vérification de l’adresse</h2>
              <p className="mt-2">
                Le nom « À qui est destiné ce colis? » sert à identifier le bénéficiaire du cadeau. Pour Mikawaii-Express ou Postes Canada,
                l’adresse officielle d’expédition est celle saisie dans Stripe Checkout. Vérifiez ces renseignements avant de payer.

              </p>
              <p className="mt-2">
                Univers Mikawaii n’est pas responsable des problèmes causés par une adresse ou des renseignements de
                contact incomplets ou inexacts fournis par le client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">5. Suivi, retard ou colis manquant</h2>
              <p className="mt-2">
                Lorsqu’un numéro de suivi est disponible pour le service utilisé, il sera communiqué au client. Si une
                commande est en retard ou semble perdue, communiquez avec nous en indiquant le numéro de commande afin
                que nous puissions vérifier les renseignements disponibles avec le transporteur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">6. Dommage pendant le transport</h2>
              <p className="mt-2">
                Si l’emballage ou un article est arrivé endommagé, contactez-nous rapidement avec le numéro de commande
                et des photos claires de l’emballage, de l’étiquette et du dommage. La situation sera évaluée au cas par
                cas, conformément aux droits obligatoires applicables.
              </p>
              <Link href="/contact" className="mt-4 inline-flex rounded-full bg-pink-500 px-5 py-3 font-bold text-white">
                Signaler un problème
              </Link>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
