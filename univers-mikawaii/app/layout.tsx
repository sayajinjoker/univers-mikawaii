import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Univers Mikawaii",
  description: "Un univers rempli de petites merveilles kawaii ✨",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${quicksand.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}