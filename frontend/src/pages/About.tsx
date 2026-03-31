import { Link } from "@tanstack/react-router";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
            <Link to="/">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-sjcs-on-surface-variant/60">About Our School</span>
          </nav>
          <h1 className="text-7xl font-headline font-extrabold tracking-tight text-sjcs-on-surface max-w-4xl leading-[1.1]">
            A Legacy of <span className="text-sjcs-primary italic">Faith</span> &amp; Academic Leadership.
          </h1>
          <p className="mt-8 text-xl text-sjcs-on-surface-variant max-w-2xl leading-relaxed">
            Since 1954, Saint Joseph Catholic School has been the cornerstone of scholastic excellence and spiritual formation in our community.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sjcs-surface-container -z-10 translate-x-20 skew-x-12"></div>
      </header>

      {/* Mission & Vision */}
      <section className="py-24 px-8 bg-sjcs-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 bg-sjcs-surface-container-lowest p-12 rounded-xl flex flex-col justify-between min-h-[400px]">
            <div>
              <span className="text-label-md text-sjcs-primary mb-4 block">Our Mission</span>
              <h2 className="text-4xl font-headline font-bold text-sjcs-on-surface mb-6">Cultivating Minds, Strengthening Souls.</h2>
              <p className="text-lg leading-relaxed text-sjcs-on-surface-variant">
                Our mission is to provide a transformative Catholic education that inspires students to pursue academic excellence, moral integrity, and a lifelong commitment to serving others in the image of Christ.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <div className="h-1 w-12 bg-sjcs-primary"></div>
              <div className="h-1 w-12 bg-sjcs-secondary opacity-30"></div>
            </div>
          </div>

          <div className="md:col-span-5 rounded-xl overflow-hidden min-h-[400px]">
            <img className="w-full h-full object-cover" alt="SJCS campus building" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXpIR6qPumCY4-QiQCHWlP6pMocqEQCc-EyPJFkgnN7ELVK2MT2TW4VsJorpARhrzE5uilCLQCgpkcUQK6Qj3aRyS9P2XqF-5hmtU_OWAKJ661z0Rytgg8tWzmrRjLmuivEH3pUEzmetOG7yMkkT-ejW0M_BBgmtB0pYgRDi6QNf99-FM3bRMqM3CXxCYE0LuMHKf1XIMZT68UlMrNe_8yQqyL0IYdV39n7Lpi7bYN1D_gLyZnjnePS3PC5iI9iRJ8-yXe4sVVZ9qT" />
          </div>

          <div className="md:col-span-4 rounded-xl overflow-hidden bg-sjcs-secondary text-white p-12 flex flex-col justify-center">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/20 text-white font-label text-xs font-bold tracking-widest uppercase w-fit">
              Our Vision
            </div>
            <h3 className="text-3xl font-headline font-bold mb-4">The Standard of Catholic Education</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              To be the leading academic institution where faith and reason meet to form future leaders who impact the world with wisdom and compassion.
            </p>
          </div>

          <div className="md:col-span-8 bg-sjcs-surface-container p-12 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "auto_stories", title: "Scholarship", desc: "Rigorous academics designed for modern challenges." },
              { icon: "church", title: "Faith", desc: "Rooted in the Gospel values and Catholic tradition." },
              { icon: "groups", title: "Community", desc: "A supportive family environment for every student." },
            ].map((v) => (
              <div key={v.title}>
                <span className="material-symbols-outlined text-sjcs-primary mb-4" style={{ fontSize: 32 }}>{v.icon}</span>
                <h4 className="font-headline font-bold text-sjcs-on-surface mb-2">{v.title}</h4>
                <p className="text-xs text-sjcs-on-surface-variant">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-24 px-8 bg-sjcs-surface-container-lowest">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 leadership-gradient opacity-10 rounded-full blur-3xl"></div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img className="w-full aspect-[4/5] object-cover" alt="Dr. Helena Rossi, Head of School" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWowmmQs4_JYrgKO-mv8lh-iEeyOwklW33WxNVDlXNxQVzVxzbc05EEfXvdH4PlH6fSkUw-3i6k9yvgMomS6l_QTdM9Qpd26bOSv8u755zj3n-280hzBJn8q_n6pPLk40VVHlOHm0FnAZMPly3CCiuMISxWMhEG_qC9vK4kFsEeRLTGHmJCIkedd0Nu8EKOLguHvo_V0ObiGKf0owNvctXAte3R46y14R8kDbt7o6StIlYPdu3_Gb6WZG2Dfw6SZ3cLrTx3ibRyUYv" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-xl shadow-xl max-w-xs">
              <p className="font-headline font-extrabold text-sjcs-primary text-xl">Dr. Helena Rossi</p>
              <p className="text-xs uppercase tracking-widest text-sjcs-on-surface-variant font-bold mt-1">Head of School</p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <span className="text-label-md text-sjcs-secondary mb-6 block">Leadership Reflection</span>
            <h2 className="text-5xl font-headline font-extrabold text-sjcs-on-surface mb-10 leading-tight">Welcome to our Scholastic Family</h2>
            <div className="space-y-6 text-sjcs-on-surface-variant leading-relaxed text-lg">
              <p>"At Saint Joseph Catholic School, we believe that education is more than just the transfer of knowledge; it is the formation of the whole human person. Our commitment to excellence is rooted in the belief that every student is a unique gift from God."</p>
              <p>Our faculty and staff work tirelessly to create an environment where intellectual curiosity is celebrated and spiritual growth is nurtured daily.</p>
              <p>I invite you to explore our campus and discover the vibrant community that makes SJCS a truly special place for academic and personal leadership.</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 px-8 bg-sjcs-surface-container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-headline font-extrabold text-sjcs-on-surface mb-4">Our History</h2>
            <p className="text-sjcs-on-surface-variant max-w-xl mx-auto">Seventy years of academic distinction and community impact.</p>
          </div>
          <div className="space-y-2">
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-xl flex gap-12 items-start">
              <span className="text-6xl font-headline font-black text-sjcs-primary/10 select-none">1954</span>
              <div>
                <h4 className="text-xl font-headline font-bold text-sjcs-on-surface mb-3">The Foundation</h4>
                <p className="text-sjcs-on-surface-variant leading-relaxed">The parish established Saint Joseph School with four classrooms and a vision for Catholic education in the heart of the city.</p>
              </div>
            </div>
            <div className="bg-sjcs-surface-container-high p-10 rounded-xl flex gap-12 items-start ml-12">
              <span className="text-6xl font-headline font-black text-sjcs-secondary/10 select-none">1982</span>
              <div>
                <h4 className="text-xl font-headline font-bold text-sjcs-on-surface mb-3">The Expansion</h4>
                <p className="text-sjcs-on-surface-variant leading-relaxed">The North Wing and the Saint Joseph Gymnasium were completed, establishing our campus as a premier athletic and academic hub.</p>
              </div>
            </div>
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-xl flex gap-12 items-start">
              <span className="text-6xl font-headline font-black text-sjcs-primary/10 select-none">2010</span>
              <div>
                <h4 className="text-xl font-headline font-bold text-sjcs-on-surface mb-3">Modernization</h4>
                <p className="text-sjcs-on-surface-variant leading-relaxed">The school underwent a full digital transformation, introducing the Leadership Information System (LIS) and state-of-the-art STEM labs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
