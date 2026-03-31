import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function LISSecurityPage() {
  const { verifiedStudent } = useAuthStore();
  const navigate = useNavigate();

  if (!verifiedStudent) {
    navigate({ to: "/lis/identity" });
    return null;
  }

  const handleContinue = () => {
    if (verifiedStudent.isActivated) {
      navigate({ to: "/lis/login" });
    } else {
      navigate({ to: "/lis/setup" });
    }
  };

  return (
    <main className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
              <span>LIS</span><span className="mx-2">/</span>
              <span className="text-sjcs-on-surface-variant/60">Security Check</span>
            </nav>
            <h1 className="text-5xl font-headline font-extrabold tracking-tight text-sjcs-on-surface mb-6 leading-tight">
              Security <span className="text-sjcs-primary">verification</span>
            </h1>
            <p className="text-lg text-sjcs-on-surface-variant leading-relaxed">
              Step 2 of 3: We found your record. Please confirm these details match your student information.
            </p>
            <div className="flex gap-2 mt-6">
              <div className="h-1 w-12 bg-sjcs-primary"></div>
              <div className="h-1 w-12 bg-sjcs-primary"></div>
              <div className="h-1 w-12 bg-sjcs-surface-container-highest"></div>
            </div>
          </div>

          <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-ambient">
            <div className="mb-8">
              <span className="material-symbols-outlined text-sjcs-secondary text-3xl mb-4">verified_user</span>
              <h2 className="font-headline text-xl font-bold">Confirm Your Identity</h2>
            </div>

            <div className="space-y-6 mb-10">
              <div className="bg-sjcs-surface-container-low p-6 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-2">Student Name</p>
                <p className="text-lg font-bold font-headline">{verifiedStudent.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sjcs-surface-container-low p-6 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-2">Grade</p>
                  <p className="text-lg font-bold font-headline">{verifiedStudent.grade}</p>
                </div>
                <div className="bg-sjcs-surface-container-low p-6 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-2">Student ID</p>
                  <p className="text-lg font-bold font-headline">{verifiedStudent.studentId}</p>
                </div>
              </div>
              <div className="bg-sjcs-surface-container-low p-6 rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-2">Account Status</p>
                <p className={`text-lg font-bold font-headline ${verifiedStudent.isActivated ? "text-green-600" : "text-amber-500"}`}>
                  {verifiedStudent.isActivated ? "Activated" : "Not Yet Activated"}
                </p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full leadership-gradient text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-sjcs-primary/30 transition-all"
            >
              {verifiedStudent.isActivated ? "Continue to Login" : "Set Up Password"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
