import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function LISSetupPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { verifiedStudent, setupPassword, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  if (!verifiedStudent) {
    navigate({ to: "/lis/identity" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    const success = await setupPassword(verifiedStudent.studentId, password);
    if (success) {
      navigate({ to: "/lis/login" });
    }
  };

  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
              <span>LIS</span><span className="mx-2">/</span>
              <span className="text-sjcs-on-surface-variant/60">Account Setup</span>
            </nav>
            <h1 className="text-5xl font-headline font-extrabold tracking-tight text-sjcs-on-surface mb-6 leading-tight">
              Create your <span className="text-sjcs-primary">password</span>
            </h1>
            <p className="text-lg text-sjcs-on-surface-variant leading-relaxed">
              Step 3 of 3: Set up a secure password for your LIS account to complete activation.
            </p>
            <div className="flex gap-2 mt-6">
              <div className="h-1 w-12 bg-sjcs-primary"></div>
              <div className="h-1 w-12 bg-sjcs-primary"></div>
              <div className="h-1 w-12 bg-sjcs-primary"></div>
            </div>
          </div>

          <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-ambient">
            <div className="mb-8">
              <span className="material-symbols-outlined text-sjcs-primary text-3xl mb-4">lock</span>
              <h2 className="font-headline text-xl font-bold">Secure Your Account</h2>
              <p className="text-sm text-sjcs-on-surface-variant mt-2">
                Setting up for: <strong>{verifiedStudent.fullName}</strong> ({verifiedStudent.studentId})
              </p>
            </div>

            {(error || localError) && (
              <div className="mb-6 p-4 rounded-lg bg-sjcs-error-container text-sjcs-on-error-container text-sm">
                {error || localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">New Password</label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-[10px] text-sjcs-on-surface-variant/60">Minimum 6 characters</p>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Confirm Password</label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full leadership-gradient text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-sjcs-primary/30 transition-all disabled:opacity-50"
              >
                {isLoading ? "Setting up..." : "Activate Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
