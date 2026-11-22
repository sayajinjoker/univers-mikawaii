import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de vente finale | Univers Mikawaii",
  description:
    "Politique de vente finale, d’annulation et de remboursement des boîtes-cadeaux surprise Univers Mikawaii.",
};

export default function SalesPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fff0f5] to-[#fdf7ff] px-6 py-12 text-[#4a3b47]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#d96b7d] hover:text-[#c95067]"
        >
          <ArrowLeft size={18} />
          Retour à la boutique
        </Link>

        <article className="mt-8 rounded-[32px] bg-white/90 p-6 shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-500">
            Politique commerciale
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Ventes finales et remboursements</h1>
          <p className="mt-4 text-sm text-gray-500">Dernière mise à jour : 22 novembre 2026</p>

          <section className="mt-8 rounded-2xl border border-pink-200 bg-pink-50 p-5">
            <h2 className="text-xl font-extrabold text-[#a7435c]">Résumé important</h2>
            <p className="mt-2 leading-7">
              Les boîtes Univers Mikawaii sont des cadeaux personnalisables contenant des articles surprise
              choisis aléatoirement. Toutes les commandes sont des ventes finales : une fois le paiement
              confirmé, aucune annulation, aucun échange et aucun remboursement ne sont offerts.
            </p>
          </section>

          <div className="mt-8 space-y-7 leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">1. Nature aléatoire des produits</h2>
              <p className="mt-2">
                Les contenus précis, couleurs, modèles, personnages, marques et combinaisons d’articles ne
                sont pas garantis. Les préférences transmises nous aident à préparer le paquet, mais ne
                constituent pas une promesse quant à la sélection exacte.
              </p>
              <p className="mt-2">
                Le fait de ne pas aimer une surprise, de recevoir un article différent de ce qui avait été
                imaginé ou d’avoir un doublon ne constitue pas un défaut permettant un retour ou un remboursement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">2. Annulation, échange et remboursement</h2>
              <p className="mt-2">
                Après la confirmation du paiement, la commande ne peut pas être annulée, modifiée, échangée
                ni remboursée. Les produits sont préparés selon les choix et renseignements fournis au moment
                de la commande.
              </p>
              <p className="mt-2">
                Le client doit vérifier son panier, ses préférences, le nom du destinataire et son adresse de
                livraison avant de payer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">3. Produit endommagé ou erreur de préparation</h2>
              <p className="mt-2">
                Si une commande est substantiellement incorrecte, est arrivée endommagée, ou comporte un
                article brisé, le client doit communiquer avec Univers Mikawaii rapidement et fournir le numéro
                de commande ainsi que des photos claires de l’emballage et du problème.
              </p>
              <p className="mt-2">
                Nous évaluerons la situation au cas par cas. Une solution appropriée pourra être offerte lorsque
                la loi l’exige ou lorsqu’Univers Mikawaii accepte une réclamation particulière, sans que cela
                modifie la politique générale de vente finale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">4. Articles perdus ou non livrés</h2>
              <p className="mt-2">
                Une adresse inexacte ou incomplète fournie par le client peut empêcher la livraison. Il est donc
                essentiel de vérifier l’adresse avant le paiement. Les erreurs de livraison signalées par le
                transporteur seront examinées avec les renseignements disponibles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">5. Droits prévus par la loi</h2>
              <p className="mt-2">
                Cette politique ne limite aucun droit qu’un consommateur ne peut légalement pas renoncer. Les
                recours obligatoires prévus par les lois applicables, notamment en cas de produit défectueux ou
                d’obligation légale de remboursement, demeurent applicables malgré la politique de vente finale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">6. Contacter Univers Mikawaii</h2>
              <p className="mt-2">
                Pour signaler un problème avec une commande, écrivez-nous en indiquant votre numéro de commande,
                une description du problème et les photos utiles.
              </p>
              <a
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 font-bold text-white"
              >
                <Mail size={18} />
                univers.mikawaii@hotmail.com
              </a>
            </section>
          </div>

          <div className="mt-10 border-t border-pink-100 pt-6 text-sm text-gray-600">
            En passant une commande, le client confirme avoir lu et accepté cette politique.
          </div>
        </article>
      </div>
    </main>
  );
}
