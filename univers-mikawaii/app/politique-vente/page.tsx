import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de ventes finales, d’échanges et de remboursements | L’Univers MiKawaii",
  description:
    "Politique de ventes finales, d’échanges et de remboursements applicable aux boîtes Lucky Scoop de L’Univers MiKawaii.",
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
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-500">Politique commerciale</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Politique de ventes finales, d’échanges et de remboursements
          </h1>
          <p className="mt-2 text-lg font-bold text-[#d96b7d]">L’Univers MiKawaii</p>

          <div className="mt-8 space-y-8 leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">1. Nature de nos produits surprises</h2>
              <p className="mt-2">
                Les boîtes Lucky Scoop de L’Univers MiKawaii contiennent une sélection aléatoire d’articles selon
                le format choisi lors de l’achat. Le contenu est déterminé par notre système de perles surprises,
                chaque perle correspondant à une catégorie ou à un type d’article.
              </p>
              <p className="mt-2">
                Les couleurs, modèles, personnages, marques et combinaisons exactes d’articles ne sont pas garantis,
                sauf indication contraire au moment de l’achat. Les préférences communiquées par le client nous
                aident à personnaliser la préparation de sa commande, mais ne constituent pas une garantie de
                recevoir des articles précis.
              </p>
              <p className="mt-2">Le nombre minimal d’articles annoncé pour chaque formule est toutefois garanti.</p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">2. Politique générale de ventes finales</h2>
              <p className="mt-2">
                En raison de la nature surprise de nos produits, toutes les ventes sont finales pour les simples
                changements d’idée ou les préférences personnelles. Aucun échange ni remboursement n’est
                généralement offert pour les motifs suivants :
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Le client n’aime pas un article reçu;</li>
                <li>Le client aurait préféré une autre couleur, un autre modèle ou un autre personnage;</li>
                <li>
                  Un article reçu ne correspond pas à ses attentes personnelles, tout en étant conforme à la
                  description annoncée;
                </li>
                <li>Le client reçoit un article en double.</li>
              </ul>
              <p className="mt-2">
                Cette politique s’applique uniquement lorsque la commande respecte les caractéristiques et les
                conditions annoncées. Elle ne limite aucun droit ou recours prévu par les lois applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">
                3. Annulation ou modification d’une commande
              </h2>
              <p className="mt-2">
                Une fois le paiement confirmé, les demandes d’annulation ou de modification pour convenance
                personnelle ne sont généralement pas acceptées. Le client est invité à vérifier attentivement son
                panier, ses préférences, le nom du destinataire et l’adresse de livraison avant de confirmer son
                achat.
              </p>
              <p className="mt-2">
                Si une erreur est constatée après le paiement, le client peut communiquer rapidement avec nous.
                Nous vérifierons si une modification est encore possible avant la préparation ou l’expédition.
                Les droits d’annulation prévus par la Loi sur la protection du consommateur du Québec, notamment
                pour les contrats conclus à distance, demeurent pleinement applicables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">
                4. Produits endommagés, défectueux ou erreurs de préparation
              </h2>
              <p className="mt-2">
                Si une commande contient un article endommagé, défectueux, substantiellement différent de sa
                description ou si une erreur de préparation est constatée, le client est invité à communiquer avec
                nous dès que possible.
              </p>
              <p className="mt-2">
                Pour faciliter le traitement de la demande, nous recommandons de fournir le numéro de commande,
                une description du problème et, si possible, des photographies. Chaque situation sera évaluée
                conformément aux garanties légales et aux droits du consommateur.
              </p>
              <p className="mt-2">
                Selon les circonstances, une réparation, un remplacement, un remboursement ou une autre solution
                appropriée pourra être proposé.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">5. Colis perdu ou non livré</h2>
              <p className="mt-2">
                Si une commande n’est pas reçue, le client est invité à communiquer avec nous afin que nous puissions
                effectuer les vérifications nécessaires auprès du transporteur. Les droits relatifs à la
                non-livraison, à l’annulation et au remboursement demeurent applicables conformément aux lois en
                vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">6. Garanties et droits prévus par la loi</h2>
              <p className="mt-2">
                Tous les articles vendus par L’Univers MiKawaii sont assujettis aux garanties légales applicables.
                Aucune disposition de cette politique ne vise à exclure, limiter ou modifier les droits auxquels
                un consommateur ne peut légalement renoncer.
              </p>
              <p className="mt-2">
                Les protections prévues notamment par la Loi sur la protection du consommateur et le Code civil du
                Québec prévalent sur toute disposition incompatible de cette politique.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#4a3b47]">7. Nous joindre</h2>
              <Link
                href="/contact"
                className="mt-4 inline-flex rounded-full bg-pink-500 px-5 py-3 font-bold text-white"
              >
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
