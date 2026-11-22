import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Univers Mikawaii",
  description:
    "Politique de confidentialité d’Univers Mikawaii : collecte, utilisation, conservation, droits et partage des renseignements personnels.",
};

const sections = [
  {
    title: "Informations personnelles que nous recueillons ou traitons",
    content: (
      <>
        <p>
          Lorsque vous utilisez notre site, nous pouvons recueillir les renseignements nécessaires pour
          préparer une commande et répondre à vos demandes, notamment :
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>nom, adresse de courriel et coordonnées de livraison;</li>
          <li>nom du destinataire du colis;</li>
          <li>choix de personnalisation, préférences et notes inscrites lors de la commande;</li>
          <li>contenu du panier, produits choisis, montant, date et référence de la commande;</li>
          <li>messages envoyés par le formulaire de contact;</li>
          <li>consentement relatif à la vente finale et, le cas échéant, au tournage de votre boîte;</li>
          <li>renseignements techniques de navigation et de connexion nécessaires au fonctionnement, à la sécurité et à la prévention des abus.</li>
        </ul>
        <p className="mt-3">
          Univers Mikawaii ne reçoit ni ne conserve normalement le numéro complet de votre carte de crédit.
          Les renseignements de paiement sont saisis et traités dans l’environnement sécurisé de Stripe.
        </p>
      </>
    ),
  },
  {
    title: "Sources d’informations personnelles",
    content: (
      <>
        <p>Nous recevons principalement vos renseignements :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>directement de vous, lorsque vous remplissez le panier, passez une commande ou utilisez le formulaire de contact;</li>
          <li>de Stripe, lorsqu’un paiement est confirmé, échoue, est annulé ou fait l’objet d’une contestation;</li>
          <li>de services techniques qui hébergent le site ou transmettent les courriels transactionnels;</li>
          <li>du transporteur, lorsqu’un suivi de livraison ou une preuve de livraison est nécessaire.</li>
        </ul>
        <p className="mt-3">
          Nous conservons le contenu du panier temporairement dans le stockage de session de votre navigateur
          afin que vous puissiez poursuivre votre visite. Ce stockage est généralement supprimé lorsque la session
          du navigateur prend fin.
        </p>
      </>
    ),
  },
  {
    title: "Comment nous utilisons vos informations personnelles",
    content: (
      <>
        <p>Nous utilisons vos renseignements pour :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>traiter et confirmer les paiements et commandes;</li>
          <li>préparer, personnaliser, expédier et, si offert, suivre la livraison des colis;</li>
          <li>envoyer les confirmations, factures, reçus et renseignements nécessaires concernant la commande;</li>
          <li>répondre à vos questions et demandes de soutien;</li>
          <li>traiter les problèmes de livraison, les produits endommagés et les contestations;</li>
          <li>respecter nos obligations légales, comptables, fiscales et de prévention de la fraude;</li>
          <li>maintenir la sécurité, diagnostiquer les incidents et prévenir les abus du site;</li>
          <li>filmer ou publier une boîte seulement lorsque vous avez donné une autorisation distincte.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Comment nous divulguons les informations personnelles",
    content: (
      <>
        <p>
          Nous ne vendons pas vos renseignements personnels. Nous pouvons transmettre uniquement les renseignements
          nécessaires aux catégories de prestataires suivantes :
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li><strong>Stripe</strong>, pour le paiement, la facture et la prévention de la fraude;</li>
          <li><strong>Resend</strong>, pour l’envoi des courriels de confirmation, de contact et de notification;</li>
          <li>le fournisseur qui héberge ou exploite le site;</li>
          <li>le transporteur ou le fournisseur d’étiquette nécessaire à la livraison;</li>
          <li>les autorités, tribunaux ou conseillers professionnels lorsque la loi l’exige ou pour protéger des droits légitimes.</li>
        </ul>
        <p className="mt-3">
          Certains prestataires peuvent traiter les données à l’extérieur du Québec ou du Canada. Ils appliquent
          leurs propres mesures de sécurité et politiques. Nous limitons autant que possible les renseignements
          communiqués à ce qui est nécessaire à leur fonction.
        </p>
      </>
    ),
  },
  {
    title: "Relation avec Stripe",
    content: (
      <>
        <p>
          Les données de paiement sont traitées par Stripe. Les personnes qui paient avec Stripe sont soumises à
          la politique de confidentialité et aux conditions de Stripe. Stripe peut agir comme prestataire ou comme
          responsable distinct du traitement selon le renseignement et l’utilisation concernés, notamment pour
          le paiement, la lutte contre la fraude, la conformité et les services fournis à son réseau.
        </p>
        <p className="mt-3">
          Univers Mikawaii reçoit de Stripe le résultat du paiement et les renseignements utiles à la commande,
          tels que le statut, la référence de transaction, l’adresse de livraison, le nom et le courriel saisis par
          le client. Pour exercer des droits directement liés aux renseignements détenus par Stripe, vous pouvez
          aussi communiquer avec Stripe selon sa politique officielle.
        </p>
      </>
    ),
  },
  {
    title: "Données relatives aux enfants",
    content: (
      <>
        <p>
          Le site et les achats ne sont pas destinés aux enfants qui ne possèdent pas la capacité légale de conclure
          un achat. Univers Mikawaii ne cherche pas à recueillir sciemment des renseignements personnels auprès d’un
          enfant sans le consentement approprié du parent ou du tuteur.
        </p>
        <p className="mt-3">
          Si vous croyez qu’un enfant nous a transmis des renseignements sans autorisation, contactez-nous afin que
          nous puissions examiner la demande et supprimer les renseignements lorsque cela est approprié.
        </p>
      </>
    ),
  },
  {
    title: "Sécurité et conservation de vos informations",
    content: (
      <>
        <p>
          Nous appliquons des mesures raisonnables adaptées à la sensibilité des renseignements : accès aux systèmes
          protégé, communications sécurisées, vérification des webhooks de paiement, limitation des accès et recours à
          des fournisseurs reconnus. Aucun système n’étant entièrement sans risque, nous ne pouvons garantir une
          sécurité absolue.
        </p>
        <p className="mt-3">
          Les renseignements sont conservés seulement pendant la période nécessaire à la finalité pour laquelle ils
          ont été recueillis, au traitement des commandes, à la preuve des transactions, aux obligations comptables et
          fiscales, à la prévention de la fraude, ou à la résolution de réclamations et litiges. Ils sont ensuite
          supprimés, anonymisés ou archivés de façon sécuritaire selon les obligations applicables.
        </p>
      </>
    ),
  },
  {
    title: "Vos droits et vos choix",
    content: (
      <>
        <p>Sous réserve des limites prévues par la loi, vous pouvez demander :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>à connaître les renseignements personnels que nous détenons à votre sujet;</li>
          <li>à accéder à ces renseignements ou à en obtenir une copie;</li>
          <li>la correction de renseignements inexacts, incomplets ou équivoques;</li>
          <li>la suppression ou la cessation d’utilisation lorsque la conservation n’est plus nécessaire;</li>
          <li>des précisions sur l’utilisation ou le partage de vos renseignements;</li>
          <li>le retrait de votre consentement lorsqu’il est le fondement du traitement, pour l’avenir.</li>
        </ul>
        <p className="mt-3">
          Nous pouvons demander des renseignements raisonnables pour confirmer votre identité. Une demande sera
          traitée dans un délai raisonnable et une réponse expliquera les limites ou obligations qui empêchent d’y
          donner suite, le cas échéant. Le retrait d’un consentement peut limiter un service et ne s’applique pas à
          un traitement déjà réalisé ou exigé par la loi.
        </p>
      </>
    ),
  },
  {
    title: "Plaintes",
    content: (
      <>
        <p>
          Si vous avez une inquiétude concernant cette politique ou la manière dont vos renseignements sont
          traités, utilisez d’abord notre formulaire de contact. Nous chercherons à examiner et résoudre la plainte.
        </p>
        <p className="mt-3">
          Si vous n’êtes pas satisfait de notre réponse au Québec, vous pouvez communiquer avec la Commission
          d’accès à l’information du Québec. Une plainte relevant d’une compétence fédérale peut également être
          adressée au Commissariat à la protection de la vie privée du Canada.
        </p>
        <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 font-bold text-white">
          <Mail size={18} />
          Formulaire de contact
        </Link>
      </>
    ),
  },
  {
    title: "Modifications de cette Politique de confidentialité",
    content: (
      <>
        <p>
          Nous pouvons modifier cette politique pour refléter l’évolution du site, des fournisseurs, des services ou
          des exigences légales. La date de mise à jour sera indiquée au début de cette page. Toute modification
          importante applicable aux renseignements sera communiquée de façon raisonnable avant d’entrer en vigueur,
          lorsque la loi l’exige.
        </p>
        <p className="mt-3">
          Nous vous recommandons de consulter cette page périodiquement. La poursuite de l’utilisation du site après
          une modification ne remplace pas un consentement distinct lorsque celui-ci est légalement requis.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fffaf8] via-[#fff0f5] to-[#fdf7ff] px-6 py-12 text-[#4a3b47]">
      <div className="mx-auto max-w-4xl">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d96b7d] hover:text-[#c95067]">
          <ArrowLeft size={18} />
          Retour à la boutique
        </Link>

        <article className="mt-8 rounded-[32px] bg-white/90 p-6 shadow-[0_25px_50px_rgba(247,190,180,0.18)] ring-1 ring-pink-100 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-500">Protection des renseignements</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Politique de confidentialité</h1>
          <p className="mt-4 text-sm text-gray-500">Dernière mise à jour : 22 novembre 2026</p>

          <p className="mt-7 leading-7 text-gray-700">
            Univers Mikawaii accorde de l’importance à la protection de votre vie privée. Cette politique explique
            quels renseignements personnels nous recueillons, pourquoi nous les utilisons, avec qui nous pouvons les
            partager et quels choix s’offrent à vous lorsque vous utilisez notre site ou achetez une boîte surprise.
          </p>

          <div className="mt-9 space-y-8">
            {sections.map((section, index) => (
              <section key={section.title} className="border-t border-pink-100 pt-7 first:border-t-0 first:pt-0">
                <h2 className="text-xl font-extrabold text-[#4a3b47]">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-3 leading-7 text-gray-700">{section.content}</div>
              </section>
            ))}
          </div>

          <section className="mt-9 rounded-2xl border border-pink-200 bg-pink-50 p-5">
            <h2 className="text-xl font-extrabold text-[#4a3b47]">Responsable des questions de confidentialité</h2>
            <p className="mt-2 leading-7 text-gray-700">
              Pour toute question, correction, accès, suppression, plainte ou retrait de consentement, utilisez notre
              formulaire de contact en mentionnant clairement « Confidentialité » dans votre message.
            </p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 font-bold text-[#c95067] underline underline-offset-2">
              <Mail size={17} />
              Contacter Univers Mikawaii
            </Link>
          </section>
        </article>
      </div>
    </main>
  );
}

