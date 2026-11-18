export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-tr from-[#FF8FC7] via-[#C9B6FF] to-[#FFD98E] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#4A3B47]">
            🌸 Univers Mikawaii
          </h2>
          <p className="mt-3 max-w-xs text-sm text-[#5E5060]">
            Découvrez des trésors kawaii soigneusement sélectionnés.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-bold text-[#4A3B47]">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#5E5060]">
            <li className="cursor-pointer transition hover:text-pink-600">
              Boutique
            </li>
            <li className="cursor-pointer transition hover:text-pink-600">
              Nos boîtes
            </li>
            <li className="transition hover:text-pink-600">
              <a href="/a-propos" className="cursor-pointer">
                À propos
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-[#4A3B47]">Aide</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#5E5060]">
            <li className="cursor-pointer transition hover:text-pink-600">
              Contact
            </li>
            <li className="cursor-pointer transition hover:text-pink-600">
              Livraison
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/40 pt-6 text-center text-sm text-[#6B5A6B]">
        © {new Date().getFullYear()} Univers Mikawaii. Tous droits réservés.
      </div>
    </footer>
  );
}