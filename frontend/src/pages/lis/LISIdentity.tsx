import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function LISIdentityPage() {
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState<number>(9);
  const { verifyStudent, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await verifyStudent(fullName, grade);
    if (success) {
      navigate({ to: "/lis/security" });
    }
  };

  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
              <span>LIS</span><span className="mx-2">/</span>
              <span className="text-sjcs-on-surface-variant/60">Identity Verification</span>
            </nav>
            <h1 className="text-5xl font-headline font-extrabold tracking-tight text-sjcs-on-surface mb-6 leading-tight">
              Let's verify your <span className="text-sjcs-primary">identity</span>
            </h1>
            <p className="text-lg text-sjcs-on-surface-variant leading-relaxed mb-4">
              Step 1 of 3: Enter your full name and grade level to locate your student record in the SJCS system.
            </p>
            <div className="flex gap-2 mt-6">
              <div className="h-1 w-12 bg-sjcs-primary"></div>
              <div className="h-1 w-12 bg-sjcs-surface-container-highest"></div>
              <div className="h-1 w-12 bg-sjcs-surface-container-highest"></div>
            </div>
          </div>

          <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-ambient">
            <div className="mb-8">
              <span className="material-symbols-outlined text-sjcs-primary text-3xl mb-4">person_search</span>
              <h2 className="font-headline text-xl font-bold">Student Lookup</h2>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-sjcs-error-container text-sjcs-on-error-container text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Full Name</label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                  placeholder="e.g. Julian Mercer"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full leadership-gradient text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-sjcs-primary/30 transition-all disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Identity"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
