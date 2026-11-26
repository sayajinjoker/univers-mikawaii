import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-tr from-[#FF8FC7] via-[#C9B6FF] to-[#FFD98E] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#4A3B47]">
            🌸 L’Univers MiKawaii
          </h2>
          <p className="mt-3 max-w-xs text-sm text-[#5E5060]">
            Découvrez des trésors MiKawaii soigneusement sélectionnés.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-bold text-[#4A3B47]">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#5E5060]">
            <li>
              <Link href="/boutique" className="transition hover:text-pink-600">
                Boutique
              </Link>
            </li>
            <li className="transition hover:text-pink-600">
              <Link href="/a-propos">À propos</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold text-[#4A3B47]">Aide</h3>
          <ul className="mt-4 space-y-2 text-sm text-[#5E5060]">
            <li>
              <Link href="/contact" className="transition hover:text-pink-600">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/livraison" className="transition hover:text-pink-600">
                Livraison
              </Link>
            </li>
            <li>
              <Link
                href="/politique-vente"
                className="transition hover:text-pink-600"
              >
                Ventes finales et remboursements
              </Link>
            </li>
            <li>
              <Link
                href="/politique-confidentialite"
                className="transition hover:text-pink-600"
              >
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/40 pt-6 text-center text-sm text-[#6B5A6B]">
        © {new Date().getFullYear()} L’Univers MiKawaii. Tous droits réservés.
      </div>
    </footer>
  );
}