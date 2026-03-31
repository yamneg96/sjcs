import { Link } from "@tanstack/react-router";

export default function ClubsPage() {
  const clubs = [
    { icon: "smart_toy", title: "Robotics Club", desc: "Design, build, and program robots for regional and national competitions.", members: 32, color: "border-sjcs-primary" },
    { icon: "gavel", title: "Mock Trial", desc: "Develop argumentation and public speaking skills through simulated court proceedings.", members: 18, color: "border-sjcs-secondary" },
    { icon: "volunteer_activism", title: "Service Corps", desc: "Organize community outreach programs and charitable initiatives throughout the year.", members: 45, color: "border-sjcs-primary" },
    { icon: "edit_note", title: "Literary Magazine", desc: "Curate and publish student poetry, short fiction, essays, and visual art.", members: 15, color: "border-sjcs-tertiary" },
    { icon: "music_note", title: "Choir & Orchestra", desc: "Perform sacred and classical music at school events, competitions, and community concerts.", members: 60, color: "border-sjcs-secondary" },
    { icon: "sports_soccer", title: "Athletic Association", desc: "Supporting school spirit through organized sporting events and intramural leagues.", members: 80, color: "border-sjcs-primary" },
    { icon: "psychology", title: "Philosophy Circle", desc: "Weekly discussions exploring ethics, epistemology, and the great thinkers of history.", members: 12, color: "border-sjcs-tertiary" },
    { icon: "public", title: "Model United Nations", desc: "Represent nations and debate global issues in simulated UN conferences.", members: 25, color: "border-sjcs-secondary" },
    { icon: "science", title: "Science Olympiad", desc: "Compete in team-based STEM challenges at regional and state levels.", members: 28, color: "border-sjcs-primary" },
  ];

  return (
    <main>
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <nav className="flex mb-8 text-[10px] uppercase tracking-[0.2em] font-bold text-sjcs-secondary font-label">
            <Link to="/">Home</Link><span className="mx-2">/</span>
            <span className="text-sjcs-on-surface-variant/60">Student Life &amp; Clubs</span>
          </nav>
          <h1 className="text-7xl font-headline font-extrabold tracking-tight text-sjcs-on-surface max-w-4xl leading-[1.1]">
            Clubs &amp; <span className="text-sjcs-primary italic">Student Life</span>
          </h1>
          <p className="mt-8 text-xl text-sjcs-on-surface-variant max-w-2xl leading-relaxed">
            Explore your passions and develop leadership skills through our diverse extracurricular programs.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sjcs-surface-container -z-10 translate-x-20 skew-x-12"></div>
      </header>

      <section className="py-24 px-8 bg-sjcs-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clubs.map((club) => (
              <div key={club.title} className={`bg-sjcs-surface-container-lowest p-10 rounded-xl border-b-4 ${club.color} hover:shadow-lg transition-shadow group`}>
                <div className="flex justify-between items-start mb-8">
                  <span className="material-symbols-outlined text-4xl text-sjcs-on-surface-variant group-hover:text-sjcs-primary transition-colors">{club.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant/40">{club.members} Members</span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-3">{club.title}</h3>
                <p className="text-sm text-sjcs-on-surface-variant leading-relaxed mb-6">{club.desc}</p>
                <button className="text-sjcs-secondary font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
