import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useMyOrganization, useUpdateOrganization } from "@/hooks/use-organization";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const userName = user?.fullName || "Staff User";

  const { data: profile, isLoading } = useMyOrganization();
  const { mutateAsync: updateOrg } = useUpdateOrganization();

  // Local config states
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Sync theme toggle with DOM theme classes
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeMode(isDark ? "dark" : "light");
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/lis/login";
  };

  const handleSavePreferences = async () => {
    try {
      if (profile) {
        // Save metadata preferences block
        await updateOrg({
          name: profile.name,
          description: profile.description || "",
        });
      }
      alert("Settings preferences synchronized successfully!");
    } catch (err: any) {
      alert("Failed to sync settings: " + (err.extractedMessage || err.message));
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground font-bold text-sm uppercase tracking-widest animate-pulse">
        Retrieving credentials settings...
      </div>
    );
  }

  return (
    <main className="min-h-screen animate-fade-in text-foreground">
      <header className="mb-10">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
          Settings
        </span>
        <h1 className="font-headline text-4xl font-black tracking-tight text-foreground">
          Academy <span className="text-primary">Configuration</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-xl">
          Review multi-tenant SaaS subscription state, manage custom branding colors, and toggle portal settings.
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <section className="bg-card rounded-2xl p-6 md:p-8 border border-border/10 shadow-ambient">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-border/10">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Tenant Profile</span>
              <h3 className="font-headline text-xl font-bold mt-1 text-foreground">{profile.name}</h3>
            </div>
            <span className="px-3 py-1 bg-secondary/15 text-secondary text-[10px] font-black uppercase rounded-full">
              SaaS Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Subdomain Portal</p>
              <p className="font-mono text-sm font-semibold">{profile.slug}.lumora.education</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Custom Academy Domain</p>
              <p className="font-mono text-sm font-semibold">{profile.website || "None configured"}</p>
            </div>
          </div>
        </section>

        {/* Global Preferences toggle options */}
        <section className="bg-card rounded-2xl p-6 md:p-8 border border-border/10 shadow-ambient">
          <h3 className="font-headline text-xl font-bold mb-6 text-foreground">Portal Preferences</h3>
          <div className="space-y-6">
            {/* Dark mode */}
            <div className="flex justify-between items-center py-3 border-b border-border/10">
              <div>
                <p className="text-sm font-bold text-foreground">Dark Contrast Mode</p>
                <p className="text-xs text-muted-foreground">Switch school admin layout to high-comfort dark styling.</p>
              </div>
              <button
                onClick={handleToggleTheme}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  themeMode === "dark" ? "bg-primary" : "bg-sjcs-surface-container-highest border border-border/15"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                    themeMode === "dark" ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex justify-between items-center py-3 border-b border-border/10">
              <div>
                <p className="text-sm font-bold text-foreground">SaaS Event Emails</p>
                <p className="text-xs text-muted-foreground">Receive triggers on new parent applications and teacher notifications.</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  notificationsEnabled ? "bg-primary" : "bg-sjcs-surface-container-highest border border-border/15"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                    notificationsEnabled ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="leadership-gradient text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md transition-all active:scale-95"
            >
              Save Preferences
            </button>
          </div>
        </section>

        {/* Billing Plan section */}
        <section className="bg-card rounded-2xl p-6 md:p-8 border border-border/10 shadow-ambient">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-secondary">Subscription Status</span>
              <h3 className="font-headline text-lg font-bold mt-1 text-foreground">Multi-Tenant Platform Billing</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Current Tier: <span className="font-bold text-primary">{profile.subscription?.plan || "Pro School (100-500 students)"}</span>
              </p>
            </div>
            <a
              href="/dashboard/payments"
              className="bg-sjcs-surface-container hover:bg-sjcs-surface-container-high px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 text-foreground border border-border/10"
            >
              View Invoices
            </a>
          </div>
        </section>

        {/* Security / Sign Out Card */}
        <section className="bg-card rounded-2xl p-6 md:p-8 border border-border/10 shadow-ambient">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-headline text-lg font-extrabold text-rose-500">Danger Zone</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Sign out of this multi-tenant admin context. You are logged in as {userName}.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm shrink-0 border border-rose-500/20"
            >
              Secure Sign Out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
