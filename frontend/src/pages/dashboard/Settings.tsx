import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "@tanstack/react-router";

export default function SettingsPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Account</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Account <span className="text-sjcs-primary">Settings</span></h1>
      </header>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient">
          <h3 className="font-headline font-bold mb-6">Preferences</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-3 border-b border-sjcs-surface-container">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-xs text-sjcs-on-surface-variant">Toggle between light and dark themes</p>
              </div>
              <button className="w-12 h-6 bg-sjcs-surface-container-highest rounded-full relative">
                <div className="w-5 h-5 bg-card rounded-full absolute left-0.5 top-0.5 shadow-sm transition-transform"></div>
              </button>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-sjcs-surface-container">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-xs text-sjcs-on-surface-variant">Receive updates about your academic progress</p>
              </div>
              <button className="w-12 h-6 bg-sjcs-primary rounded-full relative">
                <div className="w-5 h-5 bg-card rounded-full absolute right-0.5 top-0.5 shadow-sm transition-transform"></div>
              </button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium">Study Reminders</p>
                <p className="text-xs text-sjcs-on-surface-variant">Get daily reminders for study sessions</p>
              </div>
              <button className="w-12 h-6 bg-sjcs-primary rounded-full relative">
                <div className="w-5 h-5 bg-card rounded-full absolute right-0.5 top-0.5 shadow-sm transition-transform"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient">
          <h3 className="font-headline font-bold mb-6">Security</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg bg-sjcs-surface-container-low hover:bg-sjcs-surface-container transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sjcs-secondary">lock</span>
                <span className="font-medium text-sm">Change Password</span>
              </div>
              <span className="material-symbols-outlined text-sjcs-on-surface-variant">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient">
          <h3 className="font-headline font-bold mb-6 text-sjcs-error">Danger Zone</h3>
          <button onClick={handleLogout} className="bg-sjcs-error-container text-sjcs-on-error-container px-8 py-3 rounded-lg font-label text-xs font-bold tracking-widest uppercase">
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
