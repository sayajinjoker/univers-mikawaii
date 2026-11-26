export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  secondScoopUpgrade: number;
  articlesPerScoop: [number, number];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Grande boîte MiKawaii",
    price: 34,
    image: "/images/big-box.jpg",
    description: "Une grande boîte surprise remplie de trésors MiKawaii et de petites merveilles à découvrir.",
    secondScoopUpgrade: 30,
    articlesPerScoop: [20, 40],
  },
  {
    id: 2,
    name: "Petite boîte MiKawaii",
    price: 25,
    image: "/images/small-box.jpg",
    description: "Une petite boîte surprise avec de petites scoops MiKawaii, idéale pour un petit moment de magie.",
    secondScoopUpgrade: 23,
    articlesPerScoop: [15, 30],
  },
];

export function getProductById(productId: number) {
  return products.find((product) => product.id === productId);
}

export function getProductImageUrl(productId: number) {
  return getProductById(productId)?.image ?? "";
}

export function getScoopArticleCount(productId: number, scoopCount: number) {
  const product = getProductById(productId);
  if (!product) return 0;
  return product.articlesPerScoop[scoopCount === 2 ? 1 : 0];
}
