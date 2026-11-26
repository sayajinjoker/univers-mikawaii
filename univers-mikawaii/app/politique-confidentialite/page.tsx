import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité | L’Univers MiKawaii",
  description:
    "Politique de confidentialité de L’Univers MiKawaii : collecte, utilisation, conservation, protection et communication des renseignements personnels.",
};

const sections = [
  {
    title: "Renseignements personnels recueillis",
    content: (
      <>
        <p>Lorsque vous utilisez notre site Web, nous pouvons recueillir les renseignements nécessaires au traitement de vos demandes et de vos commandes, notamment :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Votre nom, votre adresse courriel et vos coordonnées de livraison;</li>
          <li>Le nom du destinataire d&apos;une commande;</li>
          <li>Vos préférences de personnalisation et les notes que vous nous transmettez;</li>
          <li>Les produits sélectionnés, le contenu du panier, les montants et les références de commande;</li>
          <li>Les messages envoyés à partir de notre formulaire de contact;</li>
          <li>Vos choix et autorisations concernant la réalisation et la diffusion éventuelle d&apos;une vidéo de votre commande;</li>
          <li>Certains renseignements techniques nécessaires au fonctionnement et à la sécurité du site.</li>
        </ul>
        <p className="mt-3">Nous limitons la collecte aux renseignements nécessaires aux fins annoncées.</p>
        <p className="mt-3">Les renseignements relatifs aux cartes de paiement sont traités par Stripe. L’Univers MiKawaii ne reçoit ni ne conserve normalement les numéros complets des cartes bancaires.</p>
      </>
    ),
  },
  {
    title: "Provenance des renseignements",
    content: (
      <>
        <p>Nous obtenons principalement vos renseignements :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Directement de vous, lorsque vous remplissez un formulaire ou effectuez un achat;</li>
          <li>De Stripe, pour confirmer le statut d&apos;un paiement ou traiter une transaction;</li>
          <li>De nos prestataires techniques, lorsque cela est nécessaire au fonctionnement du site et à l&apos;envoi des communications;</li>
          <li>De nos partenaires de livraison, lorsqu&apos;un suivi ou une vérification est nécessaire.</li>
        </ul>
        <p className="mt-3">Le contenu de votre panier peut être conservé temporairement dans le stockage de session de votre navigateur afin de faciliter votre navigation.</p>
      </>
    ),
  },
  {
    title: "Utilisation des renseignements personnels",
    content: (
      <>
        <p>Nous utilisons vos renseignements afin de :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Traiter et confirmer vos commandes et paiements;</li>
          <li>Préparer et personnaliser vos boîtes surprises;</li>
          <li>Expédier les commandes et assurer leur suivi;</li>
          <li>Vous transmettre les confirmations, factures et renseignements relatifs à vos achats;</li>
          <li>Répondre à vos questions et demandes;</li>
          <li>Traiter les réclamations, les problèmes de livraison et les contestations;</li>
          <li>Respecter nos obligations légales, comptables et fiscales;</li>
          <li>Assurer la sécurité du site et prévenir les utilisations frauduleuses.</li>
        </ul>
        <p className="mt-3">Nous n&apos;utilisons pas vos renseignements personnels à d&apos;autres fins incompatibles sans respecter les exigences légales applicables.</p>
      </>
    ),
  },
  {
    title: "Vidéos des commandes et réseaux sociaux",
    content: (
      <>
        <p>L’Univers MiKawaii peut proposer à ses clients de faire filmer la préparation de leur boîte surprise et de diffuser cette vidéo sur ses réseaux sociaux.</p>
        <p className="mt-3">Cette participation est entièrement facultative.</p>
        <p className="mt-3">Lorsqu&apos;une autorisation est nécessaire, elle est demandée séparément de l&apos;achat.</p>
        <p className="mt-3">Un client peut donc commander une boîte sans accepter la diffusion d&apos;une vidéo.</p>
        <p className="mt-3">Nous veillons à ne pas divulguer publiquement les renseignements personnels du client ou du destinataire, notamment son adresse, son numéro de téléphone ou ses renseignements de paiement.</p>
        <p className="mt-3">Les modalités de retrait d&apos;une autorisation sont soumises aux droits applicables et aux limites liées à une diffusion déjà réalisée.</p>
      </>
    ),
  },
  {
    title: "Communication des renseignements à des tiers",
    content: (
      <>
        <p>Nous ne vendons pas vos renseignements personnels.</p>
        <p className="mt-3">Nous pouvons communiquer certains renseignements nécessaires aux prestataires suivants :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Stripe, pour le traitement des paiements, des factures et la prévention de la fraude;</li>
          <li>Resend, pour la transmission des courriels transactionnels;</li>
          <li>Notre fournisseur d&apos;hébergement et nos prestataires techniques, pour le fonctionnement du site;</li>
          <li>Nos transporteurs et fournisseurs d&apos;étiquettes, pour l&apos;expédition et le suivi des colis;</li>
          <li>Les autorités ou professionnels autorisés, lorsque la loi le permet ou l&apos;exige.</li>
        </ul>
        <p className="mt-3">Nous limitons les renseignements communiqués à ce qui est nécessaire pour les services concernés.</p>
        <p className="mt-3">Certains prestataires peuvent traiter ou conserver des renseignements à l&apos;extérieur du Québec ou du Canada. Ces communications sont encadrées conformément aux exigences légales applicables, notamment celles relatives à l&apos;évaluation des risques et à la protection des renseignements personnels.</p>
      </>
    ),
  },
  {
    title: "Paiements sécurisés avec Stripe",
    content: (
      <>
        <p>Les paiements effectués sur notre site sont traités par Stripe.</p>
        <p className="mt-3">L’Univers MiKawaii reçoit les renseignements nécessaires à la gestion des commandes, notamment le statut du paiement, la référence de transaction et les coordonnées fournies lors de l&apos;achat.</p>
        <p className="mt-3">Stripe peut également traiter certains renseignements conformément à ses propres obligations légales et à sa politique de confidentialité.</p>
        <p className="mt-3">
          Pour en savoir davantage, vous pouvez consulter la politique de confidentialité de Stripe :{" "}
          <a href="https://stripe.com/fr-ca/privacy" target="_blank" rel="noreferrer" className="font-semibold text-[#c95067] underline underline-offset-2">
            https://stripe.com/fr-ca/privacy
          </a>
        </p>
      </>
    ),
  },
  {
    title: "Témoins de connexion et technologies de navigation",
    content: (
      <>
        <p>Notre site peut utiliser des mécanismes de stockage local ou de session nécessaires au fonctionnement du panier, au traitement des commandes et à la sécurité.</p>
      </>
    ),
  },
  {
    title: "Protection des renseignements des enfants",
    content: (
      <>
        <p>Nos collections peuvent contenir des produits destinés aux enfants de 3 à 10 ans. Toutefois, notre site de vente s&apos;adresse aux personnes légalement autorisées à effectuer des achats.</p>
        <p className="mt-3">Nous ne cherchons pas à recueillir directement des renseignements personnels auprès d&apos;enfants de moins de 14 ans sans le consentement requis du titulaire de l&apos;autorité parentale ou du tuteur.</p>
        <p className="mt-3">Si vous croyez qu&apos;un enfant nous a transmis des renseignements personnels sans autorisation, veuillez communiquer avec nous afin que nous puissions examiner la situation et prendre les mesures appropriées.</p>
      </>
    ),
  },
  {
    title: "Sécurité des renseignements",
    content: (
      <>
        <p>Nous mettons en place des mesures de sécurité adaptées à la nature des renseignements traités et aux risques associés.</p>
        <p className="mt-3">Ces mesures peuvent comprendre la protection des accès, l&apos;utilisation de connexions sécurisées, la limitation des accès autorisés et le recours à des prestataires offrant des mécanismes de sécurité appropriés.</p>
        <p className="mt-3">Aucun système informatique ne pouvant garantir une sécurité absolue, nous révisons nos pratiques lorsque cela est nécessaire.</p>
      </>
    ),
  },
  {
    title: "Conservation et suppression des renseignements",
    content: (
      <>
        <p>Nous conservons les renseignements personnels uniquement pendant la période nécessaire aux fins pour lesquelles ils ont été recueillis, sous réserve de nos obligations légales, fiscales, comptables ou contractuelles.</p>
        <p className="mt-3">Lorsque leur conservation n&apos;est plus nécessaire, les renseignements sont détruits ou anonymisés conformément aux exigences applicables.</p>
        <p className="mt-3">Certaines informations relatives aux transactions peuvent devoir être conservées pendant une période plus longue pour satisfaire aux obligations légales.</p>
      </>
    ),
  },
  {
    title: "Vos droits concernant vos renseignements",
    content: (
      <>
        <p>Sous réserve des conditions et exceptions prévues par la loi, vous pouvez notamment :</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Demander l&apos;accès aux renseignements personnels que nous détenons à votre sujet;</li>
          <li>Demander la rectification de renseignements inexacts, incomplets ou équivoques;</li>
          <li>Demander des renseignements sur l&apos;utilisation et la communication de vos données;</li>
          <li>Retirer votre consentement lorsque la loi le permet;</li>
          <li>Demander la cessation de certaines utilisations ou la suppression de renseignements, lorsque les conditions légales sont réunies;</li>
          <li>Demander, dans les cas prévus par la loi, la communication de certains renseignements informatisés dans un format technologique structuré et couramment utilisé.</li>
        </ul>
        <p className="mt-3">Les demandes d&apos;accès et de rectification sont traitées dans les délais prévus par la loi, généralement dans les 30 jours suivant leur réception.</p>
        <p className="mt-3">Nous pouvons demander une vérification raisonnable de votre identité avant de communiquer ou de modifier des renseignements.</p>
      </>
    ),
  },
  {
    title: "Questions et plaintes",
    content: (
      <>
        <p>Si vous avez des questions ou des préoccupations concernant la protection de vos renseignements personnels, nous vous invitons à communiquer avec notre responsable de la protection des renseignements personnels.</p>
        <p className="mt-3">Vous pouvez également déposer une plainte auprès de la Commission d&apos;accès à l&apos;information du Québec lorsque la situation relève de sa compétence.</p>
        <p className="mt-3">
          Site Web :{" "}
          <a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noreferrer" className="font-semibold text-[#c95067] underline underline-offset-2">
            https://www.cai.gouv.qc.ca
          </a>
        </p>
      </>
    ),
  },
  {
    title: "Modifications de la politique",
    content: (
      <>
        <p>Nous pouvons modifier cette politique afin de tenir compte de l&apos;évolution de nos activités, de nos services, de nos fournisseurs ou des exigences légales.</p>
        <p className="mt-3">La date de la dernière mise à jour figure au début du document.</p>
        <p className="mt-3">Lorsque la loi l&apos;exige, les modifications importantes feront l&apos;objet d&apos;une information ou d&apos;un consentement approprié.</p>
      </>
    ),
  },
  {
    title: "Nous joindre",
    content: (
      <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 font-bold text-white">
        <Mail size={18} />
        Formulaire de contact
      </Link>
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
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-500">L’Univers MiKawaii</p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Politique de confidentialité</h1>
          <p className="mt-4 text-sm text-gray-500">Dernière mise à jour : 22 novembre 2026</p>

          <p className="mt-7 leading-7 text-gray-700">
            L’Univers MiKawaii accorde une grande importance à la protection de votre vie privée et de vos renseignements personnels.
          </p>
          <p className="mt-3 leading-7 text-gray-700">
            Cette politique explique quels renseignements nous recueillons, pourquoi nous les utilisons, avec qui nous pouvons les partager, comment nous les protégeons et quels sont vos droits lorsque vous naviguez sur notre site, communiquez avec nous ou effectuez un achat.
          </p>

          <div className="mt-9 space-y-8">
            {sections.map((section, index) => (
              <section key={section.title} className="border-t border-pink-100 pt-7 first:border-t-0 first:pt-0">
                <h2 className="text-xl font-extrabold text-[#4a3b47]">{index + 1}. {section.title}</h2>
                <div className="mt-3 leading-7 text-gray-700">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
