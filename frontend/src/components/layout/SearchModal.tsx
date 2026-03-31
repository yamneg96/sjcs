import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: "Public" | "LIS" | "Dashboard";
  icon: string;
}

const allPages: SearchResult[] = [
  { title: "Home", description: "Welcome to Saint Joseph Catholic School", path: "/", category: "Public", icon: "home" },
  { title: "About Us", description: "Our mission, vision, history, and leadership", path: "/about", category: "Public", icon: "info" },
  { title: "Academics", description: "Curriculum, STEM, humanities, theology programs", path: "/academics", category: "Public", icon: "school" },
  { title: "Admissions", description: "Apply now, admissions process, schedule a tour", path: "/admissions", category: "Public", icon: "how_to_reg" },
  { title: "News & Blog", description: "Latest school news, events, and achievements", path: "/news", category: "Public", icon: "newspaper" },
  { title: "Clubs & Student Life", description: "Extracurricular activities and student organizations", path: "/clubs", category: "Public", icon: "groups" },
  { title: "Contact Us", description: "Get in touch, campus map, office hours", path: "/contact", category: "Public", icon: "mail" },
  { title: "LIS Portal", description: "Learning Intelligence System entry", path: "/lis", category: "LIS", icon: "login" },
  { title: "LIS Login", description: "Sign in to your student account", path: "/lis/login", category: "LIS", icon: "lock" },
  { title: "Student Dashboard", description: "Your academic overview and quick actions", path: "/dashboard", category: "Dashboard", icon: "dashboard" },
  { title: "AI Learning Hub", description: "Ask AI questions about your curriculum", path: "/dashboard/ai-hub", category: "Dashboard", icon: "smart_toy" },
  { title: "Study Session", description: "Start a focused timed study sprint", path: "/dashboard/study-session", category: "Dashboard", icon: "timer" },
  { title: "Study History", description: "View your past study logs and progress", path: "/dashboard/study-history", category: "Dashboard", icon: "history" },
  { title: "Mock Exams", description: "Practice with curriculum-aligned assessments", path: "/dashboard/mock-exams", category: "Dashboard", icon: "quiz" },
  { title: "Resource Library", description: "Access e-books, worksheets, and materials", path: "/dashboard/materials", category: "Dashboard", icon: "menu_book" },
  { title: "Student Profile", description: "View your academic profile and courses", path: "/dashboard/profile", category: "Dashboard", icon: "person" },
  { title: "Account Settings", description: "Preferences, security, and sign out", path: "/dashboard/settings", category: "Dashboard", icon: "settings" },
  { title: "Tuition Payments", description: "View payment history and make payments", path: "/dashboard/payments", category: "Dashboard", icon: "payments" },
  { title: "Exam Results", description: "View your exam scores and feedback", path: "/dashboard/results", category: "Dashboard", icon: "assessment" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? allPages.filter(
        (page) =>
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description.toLowerCase().includes(query.toLowerCase()) ||
          page.category.toLowerCase().includes(query.toLowerCase())
      )
    : allPages;

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) acc[result.category] = [];
      acc[result.category].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  const flatResults = results;

  const handleSelect = useCallback(
    (path: string) => {
      navigate({ to: path });
      setQuery("");
      onClose();
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && flatResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(flatResults[selectedIndex].path);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, flatResults, handleSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-[#2e3132] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-sjcs-surface-container">
          <span className="material-symbols-outlined text-sjcs-on-surface-variant text-xl">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, features, resources..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-sjcs-on-surface-variant/40 text-sjcs-on-surface"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-sjcs-surface-container text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-wider">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {flatResults.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-sjcs-on-surface-variant/30 mb-3">
                search_off
              </span>
              <p className="text-sjcs-on-surface-variant text-sm">
                No results found for "{query}"
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category}>
                <div className="px-6 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-sjcs-on-surface-variant/50">
                    {category}
                  </p>
                </div>
                {items.map((result) => {
                  const globalIndex = flatResults.indexOf(result);
                  return (
                    <button
                      key={result.path}
                      onClick={() => handleSelect(result.path)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-colors ${
                        globalIndex === selectedIndex
                          ? "bg-sjcs-surface-container-low dark:bg-white/5"
                          : "hover:bg-sjcs-surface-container-low/50"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-xl ${
                          globalIndex === selectedIndex
                            ? "text-sjcs-primary"
                            : "text-sjcs-on-surface-variant/60"
                        }`}
                      >
                        {result.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-sjcs-on-surface truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-sjcs-on-surface-variant/60 truncate">
                          {result.description}
                        </p>
                      </div>
                      {globalIndex === selectedIndex && (
                        <span className="material-symbols-outlined text-sjcs-on-surface-variant/40 text-sm">
                          subdirectory_arrow_left
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sjcs-surface-container flex items-center justify-between text-[10px] text-sjcs-on-surface-variant/50 uppercase tracking-wider font-bold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-sjcs-surface-container">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-sjcs-surface-container">↵</kbd> Open
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-sjcs-surface-container">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
