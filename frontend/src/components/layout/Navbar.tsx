import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { SearchModal } from "./SearchModal";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/news", label: "News" },
  { to: "/clubs", label: "Clubs" },
  { to: "/lis", label: "LIS Login" },
] as const;

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass dark:glass-dark shadow-ambient">
        <div className="flex justify-between items-center px-6 md:px-8 py-4 w-full max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src="/logo.png" alt="SJCS Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 rounded-full" />
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#af101a] dark:text-[#ff4d5a] font-headline">
              Saint Joseph Catholic School
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{
                  className:
                    "text-[#af101a] border-b-2 border-[#af101a] pb-1 font-headline font-bold tracking-tight",
                }}
                inactiveProps={{
                  className:
                    "text-slate-600 dark:text-slate-400 font-medium font-headline hover:text-[#005faf] transition-colors duration-300",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search button with Ctrl+K hint */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-sjcs-on-surface-variant hover:text-sjcs-primary transition-smooth"
              aria-label="Search (Ctrl+K)"
            >
              <span className="material-symbols-outlined">search</span>
              <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-sjcs-surface-container text-[10px] font-bold text-sjcs-on-surface-variant/50 tracking-wider">
                ⌘K
              </kbd>
            </button>

            {/* Contact button — hidden on small screens */}
            <Link
              to="/contact"
              className="hidden sm:block bg-sjcs-primary text-white px-6 py-2.5 rounded-lg font-headline font-bold text-sm tracking-tight scale-95 active:scale-90 transition-transform"
            >
              Contact
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-sjcs-surface-container-low transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-sjcs-on-surface transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-[3px]"
                    : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-sjcs-on-surface mt-1 transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-sjcs-on-surface mt-1 transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-[5px]"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6 pt-2 space-y-1 border-t border-sjcs-surface-container/50">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sjcs-on-surface font-headline font-medium hover:bg-sjcs-surface-container-low transition-colors"
                activeProps={{
                  className:
                    "block px-4 py-3 rounded-xl font-headline font-bold text-sjcs-primary bg-sjcs-primary-fixed/30",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile-only contact button */}
            <div className="pt-4">
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center leadership-gradient text-white px-6 py-3 rounded-xl font-headline font-bold text-sm tracking-tight"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
