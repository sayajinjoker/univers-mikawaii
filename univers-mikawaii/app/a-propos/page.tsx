import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffaf8] text-[#4a3b47]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff1f6] via-[#fff9f5] to-[#f7f0ff] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-pink-500 shadow-sm ring-1 ring-pink-100">
            À propos
          </div>

          <h1 className="max-w-none whitespace-nowrap text-[clamp(1.8rem,2.2vw,4.8rem)] font-black leading-none tracking-tight text-[#4a3b47]">
            Bienvenue dans l&apos;Univers MiKawaii! <span aria-hidden="true">🌸✨</span>
          </h1>

          <div className="mt-10 rounded-[32px] bg-white/80 p-6 shadow-[0_25px_60px_rgba(240,180,200,0.18)] ring-1 ring-pink-100 md:p-10">
            <div className="space-y-6 text-lg leading-8 text-[#5d4f5d]">
              <h2 className="text-2xl font-black text-[#4a3b47]">Qui sommes-nous?</h2>
              <p>
                Nous sommes Michelle et Kassie, un duo mère-fille qui partage un amour pour l’univers MiKawaii et tout ce qui est mignon!
              </p>

              <p>
                Notre aventure a commencé par une simple découverte…
              </p>

              <p>
                Un beau jour de printemps, Kassie a découvert le concept des Lucky Scoops, ces cuillères surprises remplies de petites découvertes. Enthousiaste, elle a partagé sa trouvaille avec Michelle et, de fil en aiguille, une idée a germé : pourquoi ne pas créer notre propre univers de surprises et partager, à notre façon, de petites étoiles de bonheur?
              </p>

              <p>
                C'est ainsi qu'est né L’Univers MiKawaii!
              </p>

              <p>
                Depuis l'été 2026, nous travaillons avec enthousiasme à dénicher de petits trésors, à imaginer nos surprises et à créer une expérience qui fera sourire les petits comme les grands.
              </p>

              <h2 className="pt-2 text-2xl font-black text-[#4a3b47]">Notre petite touche de magie ✨</h2>

              <p>
                Pour nous, le bonheur se trouve aussi dans les petites choses : un joli stylo, un accessoire adorable, une surprise inattendue ou simplement le plaisir de découvrir ce qui se cache dans une boîte.
              </p>

              <p>
                Avec nos Lucky Scoops, nous souhaitons vous offrir bien plus que de petits objets : un moment de découverte, d'émerveillement et de plaisir!
              </p>

              <p>
                Nous croyons aussi que la magie des surprises devrait être accessible à tous les budgets. C'est pourquoi nous avons imaginé différentes formules, sans réserver les plus belles découvertes uniquement aux plus grosses commandes.
              </p>

              <p>
                Un univers qui ne fait que commencer!
              </p>

              <p>
                Accompagnées de nos deux adorables mascottes, Mika et Kami, nous espérons faire grandir L’Univers MiKawaii au fil de nos découvertes, de nos idées et, surtout, des sourires que nous aurons la chance de partager avec vous.
              </p>

              <p>
                Merci de nous encourager dans cette belle aventure familiale et de faire partie de notre petit univers!
              </p>

              <p className="pt-2 font-bold text-[#d9687f]">
                Michelle & Kassie
              </p>

              <p className="italic text-[#6d5163]">
                Deux passionnées de mignonnerie qui rêvent de semer de petites étoiles de bonheur, une surprise à la fois! ⭐
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/boutique"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-[#f6b76c] px-7 py-3 font-bold text-white shadow-lg shadow-pink-200 transition hover:-translate-y-0.5"
            >
              Découvrir la boutique
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
