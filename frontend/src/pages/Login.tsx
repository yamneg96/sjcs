import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import type { AxiosError } from "axios";
import { useAdminLogin } from "@/hooks/use-auth";
import type { ApiResponse } from "@/types/api.types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      { onSuccess: () => navigate({ to: "/dashboard" }) }
    );
  };

  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-8 w-full">
        <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-2xl shadow-sjcs-secondary/10 max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-headline mb-2">Organization Workspace</h2>
            <p className="text-sm font-label uppercase tracking-widest text-sjcs-on-surface-variant/60">
              Staff &amp; Director Sign In
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-sjcs-error-container text-sjcs-on-error-container text-sm">
              {(error as AxiosError<ApiResponse<null>>)?.response?.data?.message ||
                "Invalid email or password."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                placeholder="you@sjcs.edu"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sjcs-on-surface-variant/60 hover:text-sjcs-on-surface transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full leadership-gradient text-sjcs-on-primary py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-sjcs-primary/30 transition-all mt-4 disabled:opacity-50"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
