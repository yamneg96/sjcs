import { Link } from "@tanstack/react-router";

export default function AdmissionsPage() {
  return (
    <main>
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
            <span>Home</span><span className="mx-2">/</span>
            <span className="text-sjcs-on-surface-variant/60">Admissions</span>
          </nav>
          <h1 className="text-7xl font-headline font-extrabold tracking-tight text-sjcs-on-surface max-w-4xl leading-[1.1]">
            Begin Your <span className="text-sjcs-primary italic">Journey</span> with SJCS.
          </h1>
          <p className="mt-8 text-xl text-sjcs-on-surface-variant max-w-2xl leading-relaxed">
            We welcome families who share our commitment to academic excellence and faith-based education.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sjcs-surface-container -z-10 translate-x-20 skew-x-12"></div>
      </header>

      <section className="py-24 px-8 bg-sjcs-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline text-4xl font-bold mb-4">The Admissions Process</h2>
            <div className="w-20 h-1 bg-sjcs-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              { step: "01", title: "Inquire", desc: "Submit an inquiry form or schedule a campus visit to learn about our programs.", icon: "search" },
              { step: "02", title: "Apply", desc: "Complete the online application with transcripts, teacher recommendations, and personal essay.", icon: "edit_document" },
              { step: "03", title: "Interview", desc: "Meet with our admissions team and experience the SJCS campus community firsthand.", icon: "groups" },
              { step: "04", title: "Enroll", desc: "Receive your acceptance letter and join the SJCS family for the upcoming academic year.", icon: "celebration" },
            ].map((s) => (
              <div key={s.step} className="bg-sjcs-surface-container-lowest p-10 rounded-xl relative group hover:shadow-lg transition-shadow">
                <span className="text-6xl font-headline font-black text-sjcs-primary/10 absolute top-4 right-6 select-none">{s.step}</span>
                <span className="material-symbols-outlined text-3xl text-sjcs-secondary mb-6">{s.icon}</span>
                <h3 className="font-headline text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-sm text-sjcs-on-surface-variant leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-sjcs-surface-container-lowest p-16 rounded-xl shadow-ambient max-w-3xl mx-auto text-center">
            <h2 className="font-headline text-3xl font-bold mb-6">Ready to Apply?</h2>
            <p className="text-sjcs-on-surface-variant mb-10 max-w-lg mx-auto">Join a community of scholars, leaders, and people of faith. Applications for the 2025-2026 academic year are now open.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="leadership-gradient text-sjcs-on-primary px-10 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase shadow-xl">Start Application</Link>
              <Link to="/contact" className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-10 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase">Schedule a Tour</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
