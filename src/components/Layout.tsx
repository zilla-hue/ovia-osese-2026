import { Outlet, Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Elevate header on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close drawer when viewport grows to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Programme", path: "/programme" },
    { name: "Plan Your Visit", path: "/visit" },
    { name: "Sponsors", path: "/sponsors" },
    { name: "News", path: "/news" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
    { name: "Volunteer", path: "/volunteer" },
  ];

  // Desktop link — subtle underline slides in on hover; solid on active
  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm whitespace-nowrap pb-0.5 border-b-2 transition-all duration-150",
      isActive
        ? "font-semibold text-wine-600 border-wine-600"
        : "font-medium text-stone-500 border-transparent hover:text-stone-900 hover:border-stone-300",
    ].join(" ");

  // Desktop CTA link
  const ctaClass = (base: string) =>
    ({ isActive }: { isActive: boolean }) =>
      `${base} ${isActive ? "ring-2 ring-offset-1" : ""}`;

  // Mobile link — background highlight on active
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center w-full px-4 py-3 rounded-xl text-[15px] transition-colors",
      isActive
        ? "bg-wine-50 text-wine-700 font-semibold"
        : "font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900",
    ].join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {/* ── Header ── */}
      <header
        className={[
          "bg-white sticky top-0 z-50 transition-all duration-200",
          scrolled
            ? "shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
            : "border-b border-stone-100",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <NavLink
              to="/"
              end
              aria-label="Ovia Osese 2026 — homepage"
              className="flex-shrink-0 font-serif font-bold text-wine-600 hover:text-wine-700 transition-colors text-xl xl:text-2xl"
            >
              Ovia Osese 2026
            </NavLink>

            {/* ── Desktop nav (xl+) ── */}
            <nav
              aria-label="Main navigation"
              className="hidden xl:flex items-center gap-5"
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === "/"}
                  className={desktopLinkClass}
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Visual divider before CTAs */}
              <span
                className="h-5 w-px bg-stone-200 mx-0.5"
                aria-hidden="true"
              />

              <NavLink
                to="/donate"
                className={ctaClass(
                  "px-4 py-1.5 rounded-full bg-gold text-royal-800 text-sm font-semibold hover:opacity-90 transition-all ring-gold/40 whitespace-nowrap"
                )}
              >
                Donate
              </NavLink>
              <NavLink
                to="/register"
                className={ctaClass(
                  "px-4 py-1.5 rounded-full bg-wine-600 text-white text-sm font-semibold hover:bg-wine-700 transition-all ring-wine-300 whitespace-nowrap"
                )}
              >
                Register Now
              </NavLink>
            </nav>

            {/* ── Mobile header actions (< xl) ── */}
            <div className="flex xl:hidden items-center gap-2">
              <NavLink
                to="/donate"
                aria-label="Donate to the festival"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-gold text-royal-800 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Donate
              </NavLink>
              <NavLink
                to="/register"
                aria-label="Register for the festival"
                className="inline-flex px-3 py-1.5 rounded-full bg-wine-600 text-white text-xs font-semibold hover:bg-wine-700 transition-colors"
              >
                Register
              </NavLink>
              <button
                type="button"
                onClick={() => setIsMenuOpen((v: boolean) => !v)}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                className="ml-1 p-2 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-wine-500 focus-visible:ring-offset-2 transition-colors"
              >
                {isMenuOpen
                  ? <X size={20} strokeWidth={2.5} />
                  : <Menu size={20} strokeWidth={2.5} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile / tablet drawer ── */}
        <div
          id="mobile-menu"
          className={[
            "xl:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <nav
            aria-label="Mobile navigation"
            className="border-t border-stone-100 bg-white px-4 pt-3 pb-5"
          >
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setIsMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
              <NavLink
                to="/donate"
                onClick={() => setIsMenuOpen(false)}
                className="text-center py-3 rounded-xl bg-gold text-royal-800 font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Donate
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="text-center py-3 rounded-xl bg-wine-600 text-white font-semibold text-sm hover:bg-wine-700 transition-colors"
              >
                Register Now
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-royal-600 text-stone-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Ovia Osese 2026
              </h3>
              <p className="text-sm text-gold mb-4">
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
                  <Link to="/about" className="hover:text-gold transition-colors">
                    About the Festival
                  </Link>
                </li>
                <li>
                  <Link to="/programme" className="hover:text-amber-500 transition-colors">
                    Programme
                  </Link>
                </li>
                <li>
                  <Link to="/visit" className="hover:text-amber-500 transition-colors">
                    Plan Your Visit
                  </Link>
                </li>
                <li>
                  <Link to="/sponsors" className="hover:text-amber-500 transition-colors">
                    Sponsors &amp; Partners
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-amber-500 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/donate" className="hover:text-gold transition-colors">
                    Donate
                  </Link>
                </li>
                <li>
                  <Link to="/volunteer" className="hover:text-amber-500 transition-colors">
                    Volunteer
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
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gold hover:text-gold/80 mt-2"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-royal-500 mt-12 pt-8 text-sm text-center">
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
