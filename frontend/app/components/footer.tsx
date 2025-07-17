import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Allgemein</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about#contact" className="text-gray-300 hover:text-white">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Für Handwerker</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create-profile" className="text-gray-300 hover:text-white">
                  Als Handwerker beitreten
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Über Heymano</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  Unsere Geschichte
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col justify-between items-center">
          <p className="text-sm text-gray-400 text-center sm:text-left mb-6 sm:mb-0">&copy; {currentYear} Heymano. Alle Inhalte und Materialien dieser Website unterliegen dem Urheberrecht.</p>

          <div className="flex flex-wrap justify-center gap-y-3 gap-x-6 w-full sm:w-auto">
            <Link href="/legal/impressum" className="text-sm text-gray-400 hover:text-white">
              Impressum
            </Link>
            <Link href="/legal/datenschutz" className="text-sm text-gray-400 hover:text-white">
              Datenschutzerklärung
            </Link>
            <Link href="/legal/nutzungsbedingungen" className="text-sm text-gray-400 hover:text-white">
              Nutzungsbedingungen
            </Link>
            <Link href="/legal/agb" className="text-sm text-gray-400 hover:text-white">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
