export type DeliveryMethod = "pickup" | "mikawaii-express" | "canada-post";

export interface DeliveryOption {
  id: DeliveryMethod;
  label: string;
  price: number;
  description: string;
}

export const DELIVERY_OPTIONS: readonly DeliveryOption[] = [
  {
    id: "pickup",
    label: "Cueillette au Terminus Beauport",
    price: 0,
    description: "Gratuit — remise au Terminus Beauport, au moment confirmé par courriel.",
  },
  {
    id: "mikawaii-express",
    label: "Livraison Mikawaii-Express",
    price: 5,
    description: "5,00 $ — secteurs Limoilou, Beauport et Charlesbourg seulement.",
  },
  {
    id: "canada-post",
    label: "Postes Canada",
    price: 6.9,
    description: "6,90 $ — livraison postale au Canada.",
  },
] as const;

export function getDeliveryOption(method: string | null | undefined): DeliveryOption | null {
  return DELIVERY_OPTIONS.find((option) => option.id === method) ?? null;
}
