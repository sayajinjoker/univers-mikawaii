import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">

      <Navbar />

      <main className="flex-1">
        <Hero />
      </main>

      <Footer />

    </div>
  );
}