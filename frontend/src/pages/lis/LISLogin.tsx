import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function LISLoginPage() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState<number>(9);
  const [password, setPassword] = useState("");
  const { login, adminLogin, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (isAdminMode) {
      const success = await adminLogin(email, password);
      if (success) navigate({ to: "/admin" });
    } else {
      const success = await login(fullName, grade, password);
      if (success) navigate({ to: "/dashboard" });
    }
  };

  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-8 w-full">
        <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-2xl shadow-sjcs-secondary/10 max-w-lg mx-auto relative overflow-hidden">
          {/* Admin Mode Toggle Banner */}
          <button 
            type="button"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${isAdminMode ? 'bg-sjcs-secondary text-white' : 'bg-sjcs-surface-container hover:bg-sjcs-surface-variant text-sjcs-on-surface-variant'}`}
          >
            {isAdminMode ? "Admin Mode Active" : "Staff Login"}
          </button>

          <div className="text-center mb-10 mt-2">
            <h2 className="text-2xl font-bold font-headline mb-2">{isAdminMode ? "Administrator Portal" : "Welcome Back"}</h2>
            <p className="text-sm font-label uppercase tracking-widest text-sjcs-on-surface-variant/60">Secure Academic Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-sjcs-error-container text-sjcs-on-error-container text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isAdminMode ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Full Name</label>
                  <input
                    className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                    placeholder="e.g. Julian Mercer"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isAdminMode}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Grade Level</label>
                  <select
                    className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value))}
                  >
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                    <option value={11}>Grade 11</option>
                    <option value={12}>Grade 12</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Admin Email</label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                  placeholder="admin@sjcs.edu"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={isAdminMode}
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Password</label>
                <a className="text-[10px] font-bold text-sjcs-secondary uppercase tracking-widest hover:underline" href="#">Forgot Password?</a>
              </div>
              <input
                className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full leadership-gradient text-sjcs-on-primary py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-sjcs-primary/30 transition-all mt-4 disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : "Secure Access"}
            </button>
            <p className="text-center text-[10px] text-sjcs-on-surface-variant/60 font-medium">
              By logging in, you agree to the SJCS Academic Honor Code.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
