import { Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/lis/login" });
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: "dashboard" },
    { name: "User Management", path: "/admin/users", icon: "group" },
    { name: "Student Management", path: "/admin/students", icon: "school" },
    { name: "Teacher Management", path: "/admin/teachers", icon: "co_present" },
    { name: "Materials & RAG", path: "/admin/materials", icon: "folder_open" },
    { name: "AI Monitoring (LIS)", path: "/admin/lis", icon: "psychology" },
    { name: "Payments & Finance", path: "/admin/finance", icon: "payments" },
    { name: "Academic Management", path: "/admin/academic", icon: "menu_book" },
    { name: "Reports & Analytics", path: "/admin/reports", icon: "analytics" },
    { name: "System Settings", path: "/admin/settings", icon: "settings" },
    { name: "Cardinal Crest", path: "/admin/cardinal-crest", icon: "newspaper" },
  ];

  return (
    <div className="bg-sjcs-surface text-sjcs-on-surface antialiased font-body min-h-screen">
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-sjcs-surface-container-low flex-col p-4 gap-2 z-40 hidden md:flex">
        <div className="mb-8 px-4 py-2">
          <h1 className="text-xl font-black text-sjcs-on-surface">SJCS Admin</h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant">
            Institutional Portal
          </p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "leadership-gradient text-sjcs-on-primary shadow-md translate-x-1 duration-200"
                    : "text-slate-500 hover:text-sjcs-on-surface hover:bg-slate-200/50"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "" }}>
                  {link.icon}
                </span>
                <span className="font-sans text-xs uppercase tracking-widest font-bold">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-sjcs-outline-variant/15 pt-4">
          <button className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-slate-200/50 rounded-lg transition-colors w-full text-left">
            <span className="material-symbols-outlined">help</span>
            <span className="font-sans text-xs uppercase tracking-widest font-bold">Support</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 px-4 py-3 hover:bg-sjcs-error/10 hover:text-sjcs-error rounded-lg transition-colors w-full text-left font-bold"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-sans text-xs uppercase tracking-widest">Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen flex flex-col">
        {/* TopNavBar Shell */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-8 py-3 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold bg-linear-to-br from-sjcs-primary to-sjcs-secondary bg-clip-text text-transparent">
              Saint Joseph Admin
            </span>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sjcs-on-surface-variant text-sm">
                search
              </span>
              <input
                className="pl-10 pr-4 py-1.5 bg-sjcs-surface-container rounded-full text-sm border-none focus:ring-2 focus:ring-sjcs-primary/20 w-64"
                placeholder="Global search..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="leadership-gradient text-sjcs-on-primary px-4 py-1.5 rounded-lg text-sm font-medium transition-all active:opacity-90">
              Quick Action
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-sjcs-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-sjcs-outline-variant/30">
              <img
                alt="Admin profile"
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin"
              />
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sjcs-outline-variant/30 px-6 py-2 flex justify-between items-center z-50">
        <Link to="/admin" className="flex flex-col items-center gap-1 text-sjcs-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link to="/admin/users" className="flex flex-col items-center gap-1 text-sjcs-on-surface-variant">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-bold">Users</span>
        </Link>
        <Link to="/admin/students" className="flex flex-col items-center gap-1 text-sjcs-on-surface-variant">
          <span className="material-symbols-outlined">school</span>
          <span className="text-[10px] font-bold">Students</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-sjcs-on-surface-variant">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Menu</span>
        </button>
      </nav>
    </div>
  );
}
