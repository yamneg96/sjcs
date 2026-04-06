import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout() {
  const location = useLocation();
  const { student } = useAuthStore();
  const name = student?.fullName?.split(" ")[0] || "Student";

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: "dashboard" },
    { name: "AI Hub", path: "/dashboard/ai-hub", icon: "smart_toy" },
    { name: "Materials", path: "/dashboard/materials", icon: "library_books" },
    { name: "Mock Exams", path: "/dashboard/mock-exams", icon: "quiz" },
    { name: "Exam Progress", path: "/dashboard/exam-progress", icon: "trending_up" },
    { name: "Results", path: "/dashboard/results", icon: "grade" },
    { name: "Study Session", path: "/dashboard/study-session", icon: "timer" },
    { name: "Study History", path: "/dashboard/study-history", icon: "history" },
    { name: "Payments", path: "/dashboard/payments", icon: "payments" },
    { name: "Profile", path: "/dashboard/profile", icon: "person" },
    { name: "Settings", path: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <div className="bg-sjcs-surface text-sjcs-on-surface antialiased font-body min-h-screen flex flex-col md:flex-row">
      {/* Side Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-sjcs-surface-container-lowest border-r border-sjcs-outline-variant/10 fixed h-screen top-0 left-0 pt-24 pb-8 px-4 z-40 overflow-y-auto">
        <div className="mb-8 px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full leadership-gradient flex items-center justify-center text-sjcs-on-primary font-bold shadow-md">
              {name[0]}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Welcome back,</p>
              <p className="font-headline font-bold text-lg">{name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "leadership-gradient text-sjcs-on-primary shadow-lg shadow-sjcs-primary/20 scale-[1.02]"
                    : "text-sjcs-on-surface-variant hover:bg-sjcs-surface-container-high hover:text-sjcs-on-surface"
                }`}
              >
                <span 
                  className="material-symbols-outlined text-[22px]" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}
                >
                  {link.icon}
                </span>
                <span className="font-label text-[11px] uppercase tracking-[0.1em] font-bold">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-sjcs-outline-variant/10 px-4">
          <div className="bg-sjcs-primary-container/30 rounded-2xl p-4 border border-sjcs-primary/10">
            <p className="text-[10px] font-bold text-sjcs-primary uppercase tracking-widest mb-1">Current Goal</p>
            <p className="text-sm font-semibold mb-3 tracking-tight">Geometry Mastery</p>
            <div className="w-full bg-sjcs-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="leadership-gradient h-full w-[65%] rounded-full shadow-[0_0_8px_rgba(var(--sjcs-primary-rgb),0.4)]"></div>
            </div>
            <p className="text-[10px] text-sjcs-on-surface-variant mt-2 text-right font-medium">65% Progress</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen pt-20 pb-24 md:pb-12">
        <div className="px-6 md:px-12 py-8 max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-sjcs-surface-container-lowest/90 backdrop-blur-xl border border-sjcs-outline-variant/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex justify-between items-center px-6 z-50 overflow-hidden">
        {navLinks.slice(0, 5).map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isActive ? "text-sjcs-primary scale-110" : "text-sjcs-on-surface-variant/60"
              }`}
            >
              <span 
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}
              >
                {link.icon}
              </span>
              <span className="text-[8px] font-black uppercase tracking-tighter">
                {link.name.split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
