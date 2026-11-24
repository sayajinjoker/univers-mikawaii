import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "L’Univers MiKawaii",
  description: "Un univers rempli de petites merveilles MiKawaii ✨",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${quicksand.variable} antialiased`}>
        <CartProvider>
          <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden">
            <Navbar />
            <div className="w-full min-w-0 flex-1 [&>*]:w-full [&>*]:min-w-0">
              {children}
            </div>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}