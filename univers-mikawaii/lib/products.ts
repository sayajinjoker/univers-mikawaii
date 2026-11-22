export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Grande boîte kawaii",
    price: 29.99,
    image: "/images/cute-3.jpg",
    description: "Une grande boîte surprise remplie de trésors kawaii et de petites merveilles à découvrir.",
  },
  {
    id: 2,
    name: "Mini boîte kawaii",
    price: 19.99,
    image: "/images/cute-4.jpg",
    description: "Une mini boîte surprise avec de petites scoops kawaii, idéale pour un petit moment de magie.",
  },
  {
    id: 3,
    name: "Grande boîte pour enfants",
    price: 24.99,
    image: "/images/cute.jpg",
    description: "Une grande boîte surprise pour enfants, remplie de trésors colorés et joyeux à découvrir.",
  },
  {
    id: 4,
    name: "Mini boîte pour enfants",
    price: 16.99,
    image: "/images/cute-2.jpg",
    description: "Une mini boîte pour enfants avec de petites scoops joyeuses et adorables.",
  },
];

export function getProductById(productId: number) {
  return products.find((product) => product.id === productId);
}

export function getProductImageUrl(productId: number) {
  return getProductById(productId)?.image ?? "";
}
