import { getProductById } from "@/lib/products";

export interface CheckoutCustomization {
  scoopCount: number;
  notes: string;
  surpriseStar: boolean;
  socialMediaVideo: boolean;
  recipientName: string;
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

  return {
    scoopCount: customization.scoopCount === 2 ? 2 : 1,
    notes: (customization.notes ?? "").trim().slice(0, 280),
    surpriseStar: Boolean(customization.surpriseStar),
    socialMediaVideo: Boolean(customization.socialMediaVideo),
    recipientName: (customization.recipientName ?? "").trim().slice(0, 100),
  };
}

export function computeUnitPrice(basePrice: number, customization?: CheckoutCustomization) {
  if (!customization) return basePrice;

  let total = basePrice;
  if (customization.scoopCount === 2) total += 20;
  if (customization.surpriseStar) total += 5;

  return total;
}

export function resolveCheckoutItems(rawItems: CheckoutItemInput[]) {
  return rawItems.map<ResolvedCheckoutItem>((rawItem) => {
    const product = getProductById(rawItem.id);
    if (!product) {
      throw new Error(`Produit introuvable (id ${rawItem.id}).`);
    }

    if (!Number.isInteger(rawItem.quantity) || rawItem.quantity <= 0) {
      throw new Error(`Quantite invalide pour ${product.name}.`);
    }

    const customization = normalizeCustomization(rawItem.customization);

    return {
      id: product.id,
      name: product.name,
      unitPrice: computeUnitPrice(product.price, customization),
      quantity: rawItem.quantity,
      customization,
    };
  });
}

export function buildCustomizationDescription(customization?: CheckoutCustomization) {
  if (!customization) return undefined;

  const parts = [
    `Scoop: ${customization.scoopCount}`,
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
