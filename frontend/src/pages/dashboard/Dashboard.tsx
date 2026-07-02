import { Link } from "@tanstack/react-router";
import { useStudents, useTeachers } from "@/hooks/use-members";
import { useAdmissions } from "@/hooks/use-admissions";
import { useMyOrganization } from "@/hooks/use-organization";
import lumoraTutorImg from "@/assets/lumora-tutor.png";

export default function DashboardPage() {
  const { data: studentsData, isLoading: loadingStudents } = useStudents(1, 1);
  const { data: teachersData, isLoading: loadingTeachers } = useTeachers(1, 1);
  const { data: admissionsData, isLoading: loadingAdmissions } = useAdmissions();
  const { data: orgData, isLoading: loadingOrg } = useMyOrganization();

  const loading = loadingStudents || loadingTeachers || loadingAdmissions || loadingOrg;

  const totalStudents = studentsData?.total || 0;
  const totalTeachers = teachersData?.total || 0;
  const admissionsList = admissionsData?.results || [];
  
  const pendingAdmissions = admissionsList.filter(a => a.status === "PENDING_REVIEW");
  const interviewAdmissions = admissionsList.filter(a => a.status === "INTERVIEW_SCHEDULED");

  const recentActivities = [
    { id: "1", type: "Admission", description: "New candidate application pending review", timeAgo: "Live Updates", icon: "how_to_reg" },
    { id: "2", type: "Upload", description: "Curriculum materials synced to R2 cloud storage", timeAgo: "Recently", icon: "cloud_upload" },
    { id: "3", type: "Onboarding", description: "Staff credentials and grade access active", timeAgo: "Always Active", icon: "person_add" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-[10px] uppercase font-bold tracking-widest animate-pulse">Gathering Org Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
            {orgData?.name || "Saint Joseph Academy"}
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Workspace <span className="text-primary">Overview</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-xl">
            Central intelligence hub for managing school admissions, active student registries, and cloud material syncing.
          </p>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border/10 shadow-ambient hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-105 duration-200" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">SaaS Enabled</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Students</p>
          <h3 className="text-3xl font-black text-foreground mt-1">{totalStudents}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/10 shadow-ambient hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-105 duration-200" style={{ fontVariationSettings: "'FILL' 1" }}>co_present</span>
            <span className="bg-secondary/10 text-secondary text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Faculty</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Teachers</p>
          <h3 className="text-3xl font-black text-foreground mt-1">{totalTeachers}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/10 shadow-ambient hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-amber-500 text-3xl group-hover:scale-105 duration-200" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
            {pendingAdmissions.length > 0 && (
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                {pendingAdmissions.length} Pending
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Interviews Scheduled</p>
          <h3 className="text-3xl font-black text-foreground mt-1">{interviewAdmissions.length}</h3>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/10 shadow-ambient hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-500 text-3xl group-hover:scale-105 duration-200" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            <span className="bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
              {orgData?.subscription?.plan || "Standard"}
            </span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Subscription Tier</p>
          <h3 className="text-3xl font-black text-foreground mt-1">
            {orgData?.subscription?.maxStudents || "Uncapped"} Lim
          </h3>
        </div>
      </section>

      {/* Lumora Mobile App Promo Banner */}
      <section className="bg-linear-to-r from-card to-secondary/5 border border-border/10 p-6 md:p-8 rounded-2xl shadow-ambient flex flex-col md:flex-row items-center justify-between gap-8 h-auto overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-4 max-w-2xl relative z-10">
          <span className="inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-full">
            Mobile Socratic LMS
          </span>
          <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-foreground">
            Advise Students to Download the <span className="text-secondary">Lumora Tutor</span> App
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            All student learning modules, offline study features, results tracking, and the Socratic AI Homework Assistant are now hosted on mobile. Prompt students to log in on their Android or iOS device to utilize their curriculum materials and complete mock exams.
          </p>
          <div className="flex gap-4">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground hover:bg-foreground/80 text-background px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              Get it on Google Play
            </a>
          </div>
        </div>
        <div className="shrink-0 max-w-[150px] md:max-w-[200px] border border-border/10 rounded-2xl overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 hover:scale-[1.02]">
          <img
            src={lumoraTutorImg}
            alt="Lumora Tutor Student App"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Main Core Layout: Quick Actions & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Quick Actions Panels */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <h4 className="font-headline text-lg font-bold">Quick Services</h4>
          
          <div className="bg-card rounded-2xl p-6 border border-border/10 shadow-ambient relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 leadership-gradient opacity-[0.03] rounded-bl-full transition-all group-hover:opacity-[0.08]" />
            <span className="material-symbols-outlined text-primary text-2xl mb-2">how_to_reg</span>
            <h3 className="font-headline font-bold text-base mb-1">Admissions Desk</h3>
            <p className="text-xs text-muted-foreground mb-4">Process newly submitted applications, view attachments &amp; schedule interviews.</p>
            <Link to="/dashboard/admissions" className="inline-block bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all">
              Launch desk
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/10 shadow-ambient relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 leadership-gradient opacity-[0.03] rounded-bl-full transition-all group-hover:opacity-[0.08]" />
            <span className="material-symbols-outlined text-secondary text-2xl mb-2">school</span>
            <h3 className="font-headline font-bold text-base mb-1">Scholastic CRM</h3>
            <p className="text-xs text-muted-foreground mb-4">Reset passwords, suspend access, and bulk import students via Excel/CSV.</p>
            <Link to="/dashboard/students" className="inline-block bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all">
              Manage CRM
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border/10 shadow-ambient relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 leadership-gradient opacity-[0.03] rounded-bl-full transition-all group-hover:opacity-[0.08]" />
            <span className="material-symbols-outlined text-amber-500 text-2xl mb-2">folder_open</span>
            <h3 className="font-headline font-bold text-base mb-1">Material Upload Hub</h3>
            <p className="text-xs text-muted-foreground mb-4">Drag and drop PDFs to push curriculum files directly to R2 cloud storage.</p>
            <Link to="/dashboard/materials" className="inline-block bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all">
              Upload Files
            </Link>
          </div>
        </section>

        {/* Right Column: Recent Activities & Info */}
        <section className="lg:col-span-8 bg-card p-6 md:p-8 rounded-2xl border border-border/10 shadow-ambient">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline text-lg font-bold">Platform Information</h4>
            <span className="font-black uppercase text-[10px] text-primary tracking-widest">Multi-Tenant OS Audited</span>
          </div>

          <div className="divide-y divide-border/10 mb-8">
            {recentActivities.map((act) => (
              <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 group">
                <div className="p-2 bg-sjcs-surface-container rounded-xl text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-xl">{act.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold leading-snug">{act.description}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-1">{act.timeAgo} • Action Type: {act.type}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/30 rounded-2xl border border-border/15">
            <h5 className="text-xs font-black uppercase text-secondary tracking-widest mb-2">Workspace Integrations</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                SMTP Email service credentials fully synced (Brevo active)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Cloudflare R2 Public Bucket connection verified
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Cloudflare R2 Private Bucket connection verified
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
