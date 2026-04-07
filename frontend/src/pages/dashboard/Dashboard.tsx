import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const { student } = useAuthStore();
  const name = student?.fullName?.split(" ")[0] || "Student";
  
  return (
    <div className="flex flex-col gap-12">
      <header>
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Student Dashboard</span>
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary max-w-3xl">
          Welcome back, <span
            className="leadership-gradient-text"
          >
            {name}
          </span>
        </h1>
        <p className="mt-4 text-sjcs-on-surface-variant text-lg max-w-xl leading-relaxed">
          Your academic journey continues. You have 3 pending assignments and 1 upcoming exam this week.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Quick Actions */}
        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 leadership-gradient opacity-5 rounded-bl-full transition-all group-hover:opacity-10"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-sjcs-primary mb-4 text-3xl">smart_toy</span>
              <h3 className="font-headline text-2xl font-bold mb-2">Ask AI</h3>
              <p className="text-sjcs-on-surface-variant text-sm mb-6">Stuck on a concept? Get academic leadership support instantly.</p>
              <Link to="/dashboard/ai-hub" className="block w-full leadership-gradient text-sjcs-on-primary py-3 rounded-lg font-label text-[10px] font-bold tracking-[0.15em] uppercase transition-all hover:shadow-lg active:scale-95 text-center">
                Start Inquiry
              </Link>
            </div>
          </div>
          <div className="bg-sjcs-surface-container-low rounded-xl p-8 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-sjcs-secondary mb-4 text-4xl">timer</span>
            <h3 className="font-headline text-xl font-bold mb-4">Focused Session</h3>
            <p className="text-sjcs-on-surface-variant text-sm mb-6">Ready to commit? Start a timed academic sprint.</p>
            <Link to="/dashboard/study-session" className="bg-sjcs-on-surface text-background py-3 px-8 rounded-lg font-label text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-sjcs-secondary transition-colors">
              Start Session
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <div className="bg-sjcs-surface-container-lowest rounded-xl overflow-hidden shadow-ambient flex flex-col md:flex-row min-h-[320px]">
            <div className="relative aspect-video rounded-3xl overflow-hidden group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgRxp2CB9bW8a0ZiOqKxiogbzTNLVswLe6w1w3gOQFA6o-jkqy6lkwR3VcOe97OeYkC0DrifcLeDa5SjBX70uGq8XJKsUBNdYrEgHxnP1yuJnDTxPkv6P5sr3G8vcsfKjNHmvmItJ2O4H7sR82ehj73Q1Cv5mEEcQErLIHGXX_i7js3Y4Zvg2RORr5vUBnnLYMRr2TtwL9w6lC7csyg1T3M-a8guKUZG01es2C-5-tuxaTEtU5XDBCqpOKLJksBsiadfz_6fJnIgOo" alt="School News" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-sjcs-primary/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <span className="px-3 py-1 bg-sjcs-primary text-sjcs-on-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Featured Update</span>
                <h3 className="text-2xl font-headline font-bold text-sjcs-on-primary max-w-sm">SJCS Robotics Team Advances to State Finals</h3>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-sjcs-primary-container text-sjcs-on-primary-container text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
                <span className="text-sjcs-on-surface-variant text-xs font-medium">Philosophy 101</span>
              </div>
              <h2 className="font-headline text-3xl font-bold mb-4">Metaphysics &amp; The Scholastic Method</h2>
              <div className="w-full bg-sjcs-surface-container rounded-full h-1.5 mb-6">
                <div className="bg-sjcs-primary h-1.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-sjcs-on-surface-variant font-medium">65% Completed</span>
                <button className="text-sjcs-secondary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Resume Chapter <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h4 className="font-headline text-lg font-bold mb-6">Recent Activity</h4>
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 bg-sjcs-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-sjcs-primary p-2 bg-card rounded-lg">history_edu</span>
                  <div>
                    <p className="text-sm font-semibold">Quiz Submitted</p>
                    <p className="text-xs text-sjcs-on-surface-variant">Medieval History - Grade: 94%</p>
                    <p className="text-[10px] text-sjcs-on-surface-variant/60 mt-1 uppercase tracking-tighter">2 hours ago</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-sjcs-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-sjcs-secondary p-2 bg-card rounded-lg">library_books</span>
                  <div>
                    <p className="text-sm font-semibold">Resource Unlocked</p>
                    <p className="text-xs text-sjcs-on-surface-variant">Theology: The Summa Vol 2</p>
                    <p className="text-[10px] text-sjcs-on-surface-variant/60 mt-1 uppercase tracking-tighter">Yesterday</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h4 className="font-headline text-lg font-bold mb-6">Recommended for You</h4>
              <div className="space-y-4">
                {[
                  { title: "Advanced Latin", desc: "Based on your interest in linguistic structures.", level: "Level 3", modules: "12 Modules" },
                  { title: "Scholastic Ethics", desc: "Prerequisite for your Leadership Certificate.", level: "Intro", modules: "8 Modules" },
                ].map((rec) => (
                  <div key={rec.title} className="p-5 border-2 border-sjcs-surface-container-high rounded-xl hover:border-sjcs-secondary transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sjcs-on-surface">{rec.title}</p>
                      <span className="material-symbols-outlined text-sjcs-surface-variant group-hover:text-sjcs-secondary transition-colors">add_circle</span>
                    </div>
                    <p className="text-xs text-sjcs-on-surface-variant mb-4">{rec.desc}</p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-sjcs-on-surface-variant/80 uppercase">
                      <span>{rec.level}</span><span>•</span><span>{rec.modules}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
