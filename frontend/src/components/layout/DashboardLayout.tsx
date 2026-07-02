import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";
import { useTheme } from "@/components/theme-provider";

export default function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const name = user?.fullName?.split(" ")[0] || "Admin";

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: "dashboard" },
    { name: "Admissions", path: "/dashboard/admissions", icon: "how_to_reg" },
    { name: "Students", path: "/dashboard/students", icon: "school" },
    { name: "Staff/Teachers", path: "/dashboard/teachers", icon: "co_present" },
    { name: "Materials", path: "/dashboard/materials", icon: "folder_open" },
    { name: "Settings", path: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <div className="bg-background text-foreground antialiased font-body min-h-screen flex flex-col md:flex-row transition-colors duration-300">
      {/* Side Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-sidebar border-r border-sidebar-border/30 fixed h-screen top-0 left-0 pt-24 pb-8 px-4 z-40 overflow-y-auto">
        <div className="mb-8 px-4">
          <div className="flex items-center gap-3 mb-2 animate-fade-in">
            <div className="w-10 h-10 rounded-xl leadership-gradient flex items-center justify-center text-white font-black shadow-md shadow-sjcs-primary/30">
              {name[0]}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Admin Workspace</p>
              <p className="font-headline font-bold text-base leading-none mt-1">{name}</p>
            </div>
          </div>
          <div className="mt-4 px-3 py-2 bg-sjcs-surface-container/40 rounded-xl flex justify-between items-center cursor-pointer hover:bg-sjcs-surface-container-high/60 transition-all border border-sidebar-border/10">
            <span className="text-xs font-bold tracking-tight text-foreground truncate">SJCS Administration</span>
            <span className="material-symbols-outlined text-[16px] text-muted-foreground">expand_more</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "leadership-gradient text-white shadow-lg shadow-sjcs-primary/20 scale-[1.01]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-[20px] transition-colors duration-200 ${
                    isActive ? "text-white" : "group-hover:text-primary"
                  }`} 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}
                >
                  {link.icon}
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-sidebar-border/20 px-4 flex flex-col gap-2">
          {/* Theme switcher */}
          <div className="flex bg-sjcs-surface-container/60 p-1.5 rounded-xl justify-stretch gap-1 items-center mb-2 border border-sidebar-border/10">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                theme === "light"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">light_mode</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                theme === "dark"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dark_mode</span>
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all ${
                theme === "system"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
            </button>
          </div>

          <button 
            onClick={() => {
              logout();
              window.location.href = "/lis/login";
            }}
            className="flex items-center gap-3 px-4 py-3 bg-sjcs-error-container/10 hover:bg-sjcs-error-container/20 text-sjcs-error rounded-xl transition-all w-full text-left font-bold text-[10px] uppercase tracking-widest border border-sjcs-error-container/10"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 min-h-screen pt-20 pb-24 md:pb-12 bg-background transition-colors duration-300">
        <div className="px-6 md:px-12 py-8 max-w-screen-2xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-sidebar/90 backdrop-blur-xl border border-sidebar-border/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex justify-between items-center px-6 z-50 overflow-hidden">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isActive ? "text-primary scale-110" : "text-muted-foreground/60"
              }`}
            >
              <span 
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}
              >
                {link.icon}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-tighter">
                {link.name.split("/")[0].split(" ")[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
