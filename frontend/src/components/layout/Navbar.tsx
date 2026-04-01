import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { SearchModal } from "./SearchModal";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../theme-provider";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth.store";
import LogOut from "./LogOut";

/* =========================
   Base Nav Links (Static)
========================= */

const baseNavLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admissions", label: "Admissions" },
  { to: "/news", label: "News" },
  { to: "/clubs", label: "Clubs" },
] as const;

/* =========================
   Navbar Component
========================= */

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuthStore();

  /* =========================
     Keyboard Shortcut (⌘K)
  ========================= */

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

  /* =========================
     Lock Scroll (Mobile Menu)
  ========================= */

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /* =========================
     Dynamic Auth Links
  ========================= */

  const authNav = isAuthenticated
    ? [
        { to: "/dashboard", label: "Dashboard" },
      ]
    : [
        { to: "/lis/login", label: "Login" },
      ];

  const navLinks = [...baseNavLinks, ...authNav];

  /* =========================
     Render
  ========================= */

  return (
    <>
      <nav className="bg-background fixed top-0 w-full z-50 glass dark:glass-dark shadow-ambient">
        <div className="bg-background flex justify-between items-center px-6 md:px-8 py-4 w-full mx-auto">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src="/logo.png"
              alt="SJCS Logo"
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 rounded-full"
            />
            <span className="text-xl md:text-2xl font-black tracking-tighter text-sjcs-primary dark:text-chart-5 font-headline">
              Saint Joseph Catholic School
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{
                  className:
                    "text-sjcs-primary border-b-2 border-sjcs-primary pb-1 font-headline font-bold",
                }}
                inactiveProps={{
                  className:
                    "text-muted-foreground font-medium hover:text-sjcs-secondary transition",
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Logout (Desktop) */}
            {isAuthenticated && <LogOut />}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 hover:text-sjcs-primary transition"
            >
              <span className="material-symbols-outlined">search</span>
              <kbd className="hidden md:flex px-1.5 py-0.5 text-[10px] bg-sjcs-surface-container rounded">
                ⌘K
              </kbd>
            </button>

            {/* Contact */}
            <Link
              to="/contact"
              className="hidden sm:block bg-sjcs-primary text-sjcs-on-primary px-6 py-2.5 rounded-lg font-bold text-sm"
            >
              Contact
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center"
            >
              <span
                className={`w-5 h-0.5 bg-current transition ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-current my-1 transition ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-current transition ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`bg-background lg:hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-[500px]" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="px-6 pb-6 space-y-2 border-t">

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}

            {/* Logout (Mobile) */}
            {isAuthenticated && (
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <LogOut />
              </div>
            )}

            {/* Contact */}
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center bg-sjcs-primary text-sjcs-on-primary px-6 py-3 rounded-xl"
            >
              Contact Us
            </Link>

            {/* Theme */}
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
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