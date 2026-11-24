import { type CheckoutItemInput } from "@/lib/checkout-pricing";
import { getDeliveryOption, type DeliveryMethod } from "@/lib/delivery";

export type CheckoutRequestPayload = {
  items: CheckoutItemInput[];
  acceptedSalesPolicy: true;
  deliveryMethod: DeliveryMethod;
};

export type ContactRequestPayload = {
  name: string;
  email: string;
  orderNumber: string;
  message: string;
  website: string;
};

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseCheckoutItem(item: unknown): CheckoutItemInput | null {
  if (!isRecord(item)) return null;

  const id = item.id;
  const quantity = item.quantity;
  const customization = item.customization;

  if (!Number.isInteger(id) || Number(id) <= 0) return null;
  if (!Number.isInteger(quantity) || Number(quantity) <= 0 || Number(quantity) > 25) return null;

  if (customization !== undefined) {
    if (!isRecord(customization)) return null;

    const scoopCount = customization.scoopCount;
    const notes = cleanString(customization.notes, 280);
    const surpriseStar = customization.surpriseStar;
    const socialMediaVideo = customization.socialMediaVideo;
    const recipientName = cleanString(customization.recipientName, 100);
    const audience = customization.audience;

    if (scoopCount !== 1 && scoopCount !== 2) return null;
    if (typeof surpriseStar !== "boolean") return null;
    if (typeof socialMediaVideo !== "boolean") return null;
    if (!recipientName) return null;
    if (audience !== "child" && audience !== "adult") return null;

    return {
      id: Number(id),
      quantity: Number(quantity),
      customization: {
        scoopCount,
        notes,
        surpriseStar,
        socialMediaVideo,
        recipientName,
        audience,
      },
    };
  }

  return {
    id: Number(id),
    quantity: Number(quantity),
  };
}

export function parseCheckoutRequestBody(body: unknown): ValidationResult<CheckoutRequestPayload> {
  if (!isRecord(body)) {
    return { ok: false, error: "Requete invalide.", status: 400 };
  }

  if (body.acceptedSalesPolicy !== true) {
    return {
      ok: false,
      error: "Vous devez accepter la politique de vente finale avant le paiement.",
      status: 400,
    };
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 25) {
    return { ok: false, error: "Le panier est vide ou invalide.", status: 400 };
  }

  const parsedItems: CheckoutItemInput[] = [];
  for (const item of body.items) {
    const parsedItem = parseCheckoutItem(item);
    if (!parsedItem) {
      return { ok: false, error: "Le panier contient un article invalide.", status: 400 };
    }
    parsedItems.push(parsedItem);
  }

  const deliveryMethod = cleanString(body.deliveryMethod, 40);
  if (!deliveryMethod || !getDeliveryOption(deliveryMethod)) {
    return { ok: false, error: "Veuillez choisir un mode de livraison.", status: 400 };
  }

  return {
    ok: true,
    data: {
      items: parsedItems,
      acceptedSalesPolicy: true,
      deliveryMethod: deliveryMethod as DeliveryMethod,
    },
  };
}

export function parseContactRequestBody(body: unknown): ValidationResult<ContactRequestPayload> {
  if (!isRecord(body)) {
    return { ok: false, error: "Requete invalide.", status: 400 };
  }

  const name = cleanString(body.name, 100);
  const email = cleanString(body.email, 254).toLowerCase();
  const orderNumber = cleanString(body.orderNumber, 100);
  const message = cleanString(body.message, 3000);
  const website = cleanString(body.website, 100);

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return {
      ok: false,
      error: "Veuillez fournir un nom, un courriel valide et un message d'au moins 10 caracteres.",
      status: 400,
    };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      orderNumber,
      message,
      website,
    },
  };
}

