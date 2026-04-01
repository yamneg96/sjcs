import { Link } from "@tanstack/react-router";

export default function AcademicsPage() {
  return (
    <main>
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
            <Link to="/">Home</Link><span className="mx-2">/</span>
            <span className="text-sjcs-on-surface-variant/60">Academics</span>
          </nav>
          <h1 className="text-7xl font-headline font-extrabold tracking-tight text-sjcs-on-surface max-w-4xl leading-[1.1]">
            A Curriculum of <span className="text-sjcs-primary italic">Rigor</span> &amp; Purpose.
          </h1>
          <p className="mt-8 text-xl text-sjcs-on-surface-variant max-w-2xl leading-relaxed">
            Our academic programs are structured to cultivate intellectual curiosity, critical thinking, and a passion for lifelong learning.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sjcs-surface-container -z-10 translate-x-20 skew-x-12"></div>
      </header>

      <section className="py-24 px-8 bg-sjcs-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: "biotech", title: "STEM Excellence", desc: "Advanced Placement courses in Biology, Chemistry, Physics, and Computer Science with fully-equipped modern laboratories.", color: "text-sjcs-primary", border: "border-sjcs-primary" },
              { icon: "history_edu", title: "Humanities & Arts", desc: "A rich tradition of literary analysis, creative writing, art, music, and world languages to broaden perspectives.", color: "text-sjcs-secondary", border: "border-sjcs-secondary" },
              { icon: "church", title: "Theology & Ethics", desc: "Four-year theology program integrated with philosophy, social justice, and Catholic social teaching.", color: "text-sjcs-tertiary", border: "border-sjcs-tertiary" },
            ].map((dept) => (
              <div key={dept.title} className={`bg-sjcs-surface-container-lowest p-10 rounded-xl border-b-4 ${dept.border} hover:shadow-lg transition-shadow`}>
                <span className={`material-symbols-outlined text-4xl ${dept.color} mb-6`}>{dept.icon}</span>
                <h3 className="font-headline text-2xl font-bold mb-4">{dept.title}</h3>
                <p className="text-sjcs-on-surface-variant leading-relaxed">{dept.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-sjcs-secondary text-sjcs-on-secondary p-16 rounded-xl mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-label-md opacity-80 mb-4 block">Academic Achievement</span>
                <h2 className="text-4xl font-headline font-bold mb-6">By the Numbers</h2>
                <p className="text-sjcs-on-secondary/80 leading-relaxed">Our consistent academic results speak to the dedication of our faculty and the determination of our students.</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { num: "98%", label: "College Acceptance" },
                  { num: "15+", label: "AP Courses Offered" },
                  { num: "12:1", label: "Student-Teacher Ratio" },
                  { num: "94%", label: "AP Exam Pass Rate" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-4xl font-headline font-black mb-2">{stat.num}</p>
                    <p className="text-xs uppercase tracking-widest opacity-80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold mb-4">Grade Levels</h2>
            <div className="w-20 h-1 bg-sjcs-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[9, 10, 11, 12].map((grade) => (
              <div key={grade} className="bg-sjcs-surface-container-lowest p-8 rounded-xl text-center hover:shadow-lg transition-shadow group">
                <div className="w-20 h-20 rounded-full leadership-gradient mx-auto mb-6 flex items-center justify-center text-sjcs-on-primary font-headline text-2xl font-black group-hover:scale-110 transition-transform">
                  {grade}
                </div>
                <h3 className="font-headline text-xl font-bold mb-2">Grade {grade}</h3>
                <p className="text-sm text-sjcs-on-surface-variant">
                  {grade === 9 && "Foundation courses building core academic skills."}
                  {grade === 10 && "Expanded curriculum with introduction to AP options."}
                  {grade === 11 && "Advanced coursework and college preparation."}
                  {grade === 12 && "Capstone projects and university transition support."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
