import { Outlet, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programme", path: "/programme" },
    { name: "Plan Your Visit", path: "/visit" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "News", path: "/news" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-2xl font-serif font-bold text-amber-800"
              >
                Ovia Osese 2026
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-stone-600 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/register"
                className="bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-800 transition-colors"
              >
                Register Now
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-600 hover:text-stone-900 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center mt-4 bg-amber-700 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-amber-800"
              >
                Register Now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Ovia Osese 2026
              </h3>
              <p className="text-sm text-amber-500 mb-4">
                Ogori Descendants Union (ODU) · Festival Secretariat
              </p>
              <p className="text-stone-400 max-w-md">
                A celebration of culture, heritage, and unity. Join us in
                preserving and honouring the rich traditions of the Ogori
                people.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-amber-500 transition-colors"
                  >
                    About the Festival
                  </Link>
                </li>
                <li>
                  <Link
                    to="/programme"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Programme
                  </Link>
                </li>
                <li>
                  <Link
                    to="/visit"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Plan Your Visit
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sponsors"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Sponsors &amp; Partners
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:info@oviaosese.ng"
                    className="hover:text-amber-500 transition-colors"
                  >
                    info@oviaosese.ng
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+234XXXXXXXXXX"
                    className="hover:text-amber-500 transition-colors"
                  >
                    +234 XXX XXX XXXX
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-500 transition-colors"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-500 hover:text-amber-400 mt-2"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-sm text-center">
            <p>
              &copy; {new Date().getFullYear()} Ovia Osese Festival · Ogori
              Descendants Union. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
