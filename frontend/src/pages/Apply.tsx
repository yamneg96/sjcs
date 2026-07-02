import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSubmitPublicApplication } from "@/hooks/use-admissions";
import type { SubmitApplicationPayload } from "@/types/api.types";

// The org slug for public admissions — in production this could come from the URL or env
const ORG_SLUG = "sjcs";

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: "Parent / Guardian",
  2: "Student Information",
  3: "Review & Submit",
};

const STEP_ICONS: Record<Step, string> = {
  1: "family_restroom",
  2: "school",
  3: "task_alt",
};

export default function ApplyPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");

  // Form state
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentDOB, setStudentDOB] = useState("");
  const [studentGender, setStudentGender] = useState<"male" | "female">("male");
  const [gradeAppliedFor, setGradeAppliedFor] = useState(1);
  const [previousSchool, setPreviousSchool] = useState("");
  const [transferReason, setTransferReason] = useState("");

  const { mutateAsync: submitApp, isPending } = useSubmitPublicApplication();

  const canProceedStep1 = parentName.trim() && parentEmail.trim() && parentPhone.trim();
  const canProceedStep2 = studentFirstName.trim() && studentLastName.trim() && studentDOB;

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = async () => {
    const payload: SubmitApplicationPayload = {
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim(),
      parentPhone: parentPhone.trim(),
      studentFirstName: studentFirstName.trim(),
      studentLastName: studentLastName.trim(),
      studentDOB,
      studentGender,
      gradeAppliedFor,
      previousSchool: previousSchool.trim() || undefined,
      transferReason: transferReason.trim() || undefined,
    };

    try {
      const result = await submitApp({ orgSlug: ORG_SLUG, data: payload });
      setRefId(result._id);
      setSubmitted(true);
    } catch (err: any) {
      alert("Submission failed: " + (err.extractedMessage || err.message));
    }
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-8">
          <div className="bg-sjcs-surface-container-lowest p-12 rounded-2xl shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold text-foreground">
              Application Submitted!
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
              Thank you for applying. A confirmation email has been sent to <strong className="text-foreground">{parentEmail}</strong>. 
              Our admissions team will review your application and reach out with next steps.
            </p>
            <div className="bg-sjcs-surface-container p-4 rounded-xl inline-block">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Application Reference</p>
              <p className="font-mono text-sm font-bold text-primary">{refId}</p>
            </div>
            <div className="pt-4">
              <Link to="/" className="leadership-gradient text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg inline-block">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-8">
        {/* Header */}
        <header className="text-center mb-10">
          <nav className="flex items-center justify-center text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label mb-6">
            <Link to="/" className="hover:text-sjcs-primary transition-colors">Home</Link>
            <span className="mx-2 text-sjcs-on-surface-variant/40">/</span>
            <Link to="/admissions" className="hover:text-sjcs-primary transition-colors">Admissions</Link>
            <span className="mx-2 text-sjcs-on-surface-variant/40">/</span>
            <span className="text-sjcs-on-surface-variant/60">Apply</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-foreground">
            Start Your <span className="text-sjcs-primary italic">Application</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Complete the form below to begin the admissions process. All fields marked with * are required.
          </p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {([1, 2, 3] as Step[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                if (s < step) setStep(s);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                s === step
                  ? "leadership-gradient text-white shadow-lg"
                  : s < step
                  ? "bg-emerald-500/10 text-emerald-600 cursor-pointer hover:bg-emerald-500/20"
                  : "bg-sjcs-surface-container text-muted-foreground cursor-default"
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: s < step ? "'FILL' 1" : "" }}>
                {s < step ? "check_circle" : STEP_ICONS[s]}
              </span>
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
              <span className="sm:hidden">Step {s}</span>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-sjcs-surface-container-lowest p-8 md:p-12 rounded-2xl shadow-2xl shadow-sjcs-secondary/10 relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-full h-1 leadership-gradient" />

          {/* Step 1: Parent Info */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-headline text-2xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-sjcs-primary" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                  Parent / Guardian Details
                </h2>
                <p className="text-sm text-muted-foreground">We'll use this information to contact you about your child's application status.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Full Name *</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Maria Johnson"
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-primary/50 focus:border-sjcs-primary transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Email Address *</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@email.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-primary/50 focus:border-sjcs-primary transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Phone Number *</label>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-primary/50 focus:border-sjcs-primary transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Student Info */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-headline text-2xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-sjcs-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                  Student Information
                </h2>
                <p className="text-sm text-muted-foreground">Provide the applicant's academic and personal details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">First Name *</label>
                  <input
                    type="text"
                    value={studentFirstName}
                    onChange={(e) => setStudentFirstName(e.target.value)}
                    placeholder="e.g. James"
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Last Name *</label>
                  <input
                    type="text"
                    value={studentLastName}
                    onChange={(e) => setStudentLastName(e.target.value)}
                    placeholder="e.g. Johnson"
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Date of Birth *</label>
                  <input
                    type="date"
                    value={studentDOB}
                    onChange={(e) => setStudentDOB(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Gender *</label>
                  <select
                    value={studentGender}
                    onChange={(e) => setStudentGender(e.target.value as "male" | "female")}
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Grade Applying For *</label>
                  <select
                    value={gradeAppliedFor}
                    onChange={(e) => setGradeAppliedFor(Number(e.target.value))}
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Previous School</label>
                  <input
                    type="text"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-label">Reason for Transfer</label>
                  <textarea
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="Optional — briefly describe why you'd like to join our school"
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-xl bg-sjcs-surface-container-low border border-border/20 focus:ring-2 focus:ring-sjcs-secondary/50 focus:border-sjcs-secondary transition-all outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h2 className="font-headline text-2xl font-bold text-foreground flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  Review Your Application
                </h2>
                <p className="text-sm text-muted-foreground">Please verify all details before submitting. You can go back to edit any section.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parent Summary */}
                <div className="bg-sjcs-surface-container p-6 rounded-xl space-y-3 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sjcs-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>family_restroom</span>
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary">Parent / Guardian</h4>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Name</p>
                    <p className="text-sm font-semibold">{parentName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Email</p>
                    <p className="text-sm font-semibold">{parentEmail}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Phone</p>
                    <p className="text-sm font-semibold">{parentPhone}</p>
                  </div>
                </div>

                {/* Student Summary */}
                <div className="bg-sjcs-surface-container p-6 rounded-xl space-y-3 border border-border/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sjcs-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-secondary">Student</h4>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Full Name</p>
                    <p className="text-sm font-semibold">{studentFirstName} {studentLastName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">DOB</p>
                      <p className="text-sm font-semibold">{new Date(studentDOB).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Gender</p>
                      <p className="text-sm font-semibold capitalize">{studentGender}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Grade</p>
                    <p className="text-sm font-semibold">Grade {gradeAppliedFor}</p>
                  </div>
                  {previousSchool && (
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Previous School</p>
                      <p className="text-sm font-semibold">{previousSchool}</p>
                    </div>
                  )}
                  {transferReason && (
                    <div>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Transfer Reason</p>
                      <p className="text-sm font-semibold">{transferReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400">
                <span className="material-symbols-outlined text-sm align-middle mr-1.5">info</span>
                By submitting this application, you confirm that all information provided is accurate. Our admissions team will review your application and notify you via email.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-border/10">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-5 py-3 rounded-xl hover:bg-sjcs-surface-container"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Previous
              </button>
            ) : (
              <Link
                to="/admissions"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-5 py-3 rounded-xl hover:bg-sjcs-surface-container"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Cancel
              </Link>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="leadership-gradient text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Info */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-muted-foreground">
            Need help? Contact our admissions office at{" "}
            <a href="mailto:admissions@sjcs.edu" className="text-sjcs-primary hover:underline font-semibold">
              admissions@sjcs.edu
            </a>{" "}
            or call <span className="font-semibold">(555) 123-4567</span>
          </p>
        </div>
      </div>
    </main>
  );
}
