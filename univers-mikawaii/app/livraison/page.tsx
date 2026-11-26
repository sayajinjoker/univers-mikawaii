import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de livraison | L’Univers MiKawaii",
  description: "Territoire, frais, préparation, délais, suivi et traitement des problèmes de livraison de L’Univers MiKawaii.",
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
          <p className="mt-2 text-lg font-bold text-[#d96b7d]">L’Univers MiKawaii</p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">1. Territoire desservi</h2>
              <p className="mt-2">
                L’Univers MiKawaii offre actuellement la livraison exclusivement au Québec. Les destinations
                admissibles sont celles proposées dans notre formulaire de paiement sécurisé Stripe. Si une
                adresse ne peut pas être sélectionnée au moment de l’achat, la livraison à cette destination n’est
                pas offerte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">2. Frais de livraison</h2>
              <p className="mt-2">
                Les frais de livraison sont calculés selon les conditions applicables à la commande et sont
                clairement indiqués avant la confirmation du paiement.
              </p>
              <p className="mt-2">
                Le client peut consulter le coût de la livraison, les taxes applicables et le montant total de sa
                commande avant de finaliser son achat. Aucun frais supplémentaire ne sera ajouté après la
                conclusion du contrat sans l’accord du client, sauf dans les cas permis par la loi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">3. Préparation et délais de livraison</h2>
              <p className="mt-2">
                Chaque boîte MiKawaii est préparée individuellement avec soin, selon le format choisi et les
                préférences transmises par le client.
              </p>
              <p className="mt-2">
                Le délai habituel de préparation est de <strong>[délai à confirmer] jours ouvrables</strong>. Le
                délai ou la date de livraison prévu pour la commande est communiqué au client avant la confirmation
                de son achat.
              </p>
              <p className="mt-2">
                Des circonstances particulières, notamment les conditions météorologiques, les périodes de fort
                achalandage ou les perturbations du transport, peuvent occasionner des retards. En cas de retard ou
                de non-livraison, les droits du consommateur prévus par la législation applicable demeurent
                pleinement respectés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">4. Destinataire et adresse de livraison</h2>
              <p className="mt-2">
                Le nom indiqué dans le champ « À qui est destiné ce colis? » permet d’identifier la personne à qui
                le cadeau est destiné. L’adresse officielle utilisée pour l’expédition est celle saisie dans Stripe
                Checkout.
              </p>
              <p className="mt-2">
                Le client doit vérifier l’exactitude et l’intégralité de ses renseignements avant de confirmer son
                achat. Si une erreur d’adresse ou des renseignements incomplets empêchent la livraison, nous
                examinerons la situation selon les circonstances et les obligations légales applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">5. Confirmation de commande et suivi</h2>
              <p className="mt-2">
                Après la confirmation de son achat, le client reçoit un courriel de confirmation contenant les
                renseignements relatifs à sa commande. Lorsqu’un numéro de suivi est disponible pour le service de
                livraison utilisé, celui-ci est communiqué au client.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">6. Retard, colis perdu ou non livré</h2>
              <p className="mt-2">
                Si une commande est en retard, semble perdue ou est indiquée comme livrée sans avoir été reçue, le
                client est invité à communiquer avec nous en fournissant son numéro de commande.
              </p>
              <p className="mt-2">
                Nous effectuerons les vérifications nécessaires auprès du transporteur afin de déterminer les
                démarches appropriées. Les droits d’annulation et de remboursement prévus par les lois applicables
                demeurent en vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">7. Colis ou articles endommagés</h2>
              <p className="mt-2">
                Si un colis ou un article arrive endommagé, nous invitons le client à communiquer avec nous dès que
                possible. Afin de faciliter le traitement de la demande, nous recommandons de fournir :
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Le numéro de commande;</li>
                <li>Une description du problème;</li>
                <li>Des photographies de l’emballage, de l’étiquette et des articles endommagés, si possible.</li>
              </ul>
              <p className="mt-2">
                Chaque situation sera examinée conformément aux garanties légales et aux droits applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">8. Nous joindre</h2>
              <Link href="/contact" className="mt-4 inline-flex rounded-full bg-pink-500 px-5 py-3 font-bold text-white">
                Contacter L’Univers MiKawaii
              </Link>
            </section>
          </div>

          <p className="mt-9 border-t border-pink-100 pt-5 text-sm text-gray-500">
            Dernière mise à jour : 23 novembre 2026
          </p>
        </article>
      </div>
    </main>
  );
}
