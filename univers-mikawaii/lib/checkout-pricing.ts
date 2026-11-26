import { getProductById } from "@/lib/products";

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

export interface CheckoutCustomization {
  scoopCount: number;
  notes: string;
  surpriseStar: boolean;
  socialMediaVideo: boolean;
  recipientName: string;
  audience: "child" | "adult";
}

export interface CheckoutItemInput {
  id: number;
  quantity: number;
  customization?: CheckoutCustomization;
}

export interface ResolvedCheckoutItem {
  id: number;
  name: string;
  unitPrice: number;
  quantity: number;
  customization?: CheckoutCustomization;
}

function normalizeCustomization(customization?: CheckoutCustomization) {
  if (!customization) return undefined;

  if (customization.scoopCount !== 1 && customization.scoopCount !== 2) {
    throw new CheckoutValidationError("Le nombre de scoops est invalide.");
  }

  const recipientName = (customization.recipientName ?? "").trim();
  if (!recipientName) {
    throw new CheckoutValidationError("Le nom du destinataire est obligatoire.");
  }

  if (customization.audience !== "child" && customization.audience !== "adult") {
    throw new CheckoutValidationError("Veuillez choisir Enfant ou Adulte.");
  }

  if (typeof customization.surpriseStar !== "boolean") {
    throw new CheckoutValidationError("Veuillez répondre à l’option étoile surprise.");
  }

  if (typeof customization.socialMediaVideo !== "boolean") {
    throw new CheckoutValidationError("Veuillez répondre à l’option vidéo pour les réseaux sociaux.");
  }

  return {
    scoopCount: customization.scoopCount,
    notes: (customization.notes ?? "").trim(),
    surpriseStar: customization.surpriseStar,
    socialMediaVideo: customization.socialMediaVideo,
    recipientName: recipientName.slice(0, 100),
    audience: customization.audience,
  };
}

export function computeUnitPrice(basePrice: number, customization?: CheckoutCustomization, secondScoopUpgrade = 0) {
  if (!customization) return basePrice;

  let total = basePrice;
  if (customization.scoopCount === 2) total += secondScoopUpgrade;
  if (customization.surpriseStar) total += 5;

  return total;
}

export function resolveCheckoutItems(rawItems: CheckoutItemInput[]) {
  return rawItems.map<ResolvedCheckoutItem>((rawItem) => {
    const product = getProductById(rawItem.id);
    if (!product) {
      throw new CheckoutValidationError(`Produit introuvable (id ${rawItem.id}).`);
    }

    if (!Number.isInteger(rawItem.quantity) || rawItem.quantity <= 0) {
      throw new CheckoutValidationError(`Quantite invalide pour ${product.name}.`);
    }

    const customization = normalizeCustomization(rawItem.customization);
    if (!customization) {
      throw new CheckoutValidationError(`La personnalisation de ${product.name} est obligatoire.`);
    }

    return {
      id: product.id,
      name: product.name,
      unitPrice: computeUnitPrice(product.price, customization, product.secondScoopUpgrade),
      quantity: rawItem.quantity,
      customization,
    };
  });
}

export function buildCustomizationDescription(customization?: CheckoutCustomization, articleCount?: number) {
  if (!customization) return undefined;

  const parts = [
    `Scoop: ${customization.scoopCount}`,
    ...(articleCount ? [`Articles: ${articleCount}`] : []),
    `Public: ${customization.audience === "child" ? "Enfant" : "Adulte"}`,
    `Etoile surprise: ${customization.surpriseStar ? "Oui" : "Non"}`,
    `Video reseaux: ${customization.socialMediaVideo ? "Oui" : "Non"}`,
  ];

  if (customization.recipientName) {
    parts.push(`Destinataire: ${customization.recipientName}`);
  }

  if (customization.notes) {
    parts.push(`Preferences: ${customization.notes}`);
  }

  return parts.join(" | ");
}

export const PREFERENCES_MAX_LENGTH = 2000;
