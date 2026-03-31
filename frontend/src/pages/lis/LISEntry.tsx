import { Link } from "@tanstack/react-router";

export default function LISEntryPage() {
  return (
    <main className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-sjcs-surface-container-high rounded-full">
              <span className="text-xs font-bold uppercase tracking-widest text-sjcs-secondary font-label">The Future of Education</span>
            </div>
            <h1 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-tight font-headline text-sjcs-on-surface">
              Access your <br /><span className="text-sjcs-primary">learning system</span>
            </h1>
            <p className="text-lg text-sjcs-on-surface-variant max-w-lg leading-relaxed">
              Welcome to the LIS (Learning Intelligence System). A centralized, AI-driven platform designed to empower SJCS students with personalized academic pathways and leadership resources.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/lis/identity" className="leadership-gradient text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-sm shadow-xl shadow-sjcs-primary/20 hover:scale-105 active:scale-95 transition-all">
                Start Learning
              </Link>
              <button className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-sjcs-surface-container-high transition-all">
                View Tutorials
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl shadow-black/10">
              <img className="w-full h-full object-cover" alt="Modern university library" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACv_4b2ujA9UbGjy1TAmBSU2vd55WMDkYcRYJMR74V28tIoAHjWF7B04TBlMdXHKzUEygPnL8ev4jNg9CtAevQkICl1uzaOsAulYSfF9O4kSk7YX6ISmQVvsBps9FovyrEFkvJ00n8BqC_bY0LgWFg-czXpp4b_xBjhqQGf8IR7MK1BIO6OvNS4YdJlOd5P_zzKBW0brqXkedr4ydS8hf3qqPUEKJ_6SWey7kPFwADGJ3gUjYkJ22Bwn7X7pBSM8YNQkjQIxxd8oH3" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-sjcs-surface-container-lowest p-8 rounded-xl shadow-xl max-w-xs hidden md:block">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full leadership-gradient flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div>
                  <p className="text-sm font-bold font-headline">Intelligence Active</p>
                  <p className="text-[10px] uppercase tracking-widest text-sjcs-secondary font-label">Real-time Academic Insights</p>
                </div>
              </div>
              <p className="text-xs text-sjcs-on-surface-variant leading-relaxed">Your curriculum is being optimized based on your latest assessment performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="bg-sjcs-surface-container py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold font-headline mb-4">The LIS Advantage</h2>
              <p className="text-sjcs-on-surface-variant leading-relaxed">Integrated technology that respects tradition while embracing modern academic excellence.</p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-1 bg-sjcs-primary"></div>
              <div className="w-12 h-1 bg-sjcs-secondary"></div>
              <div className="w-12 h-1 bg-sjcs-surface-container-highest"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-sjcs-surface-container-lowest p-10 rounded-xl flex flex-col justify-between group hover:shadow-lg transition-all border-b-4 border-transparent hover:border-sjcs-primary">
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-4xl text-sjcs-primary">account_tree</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sjcs-on-surface-variant/40">Module 01</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold font-headline mb-4">Dynamic Academic Planning</h3>
                <p className="text-sjcs-on-surface-variant leading-relaxed mb-6">Map your entire high school journey with our predictive curriculum tool.</p>
                <a href="#" className="text-sjcs-secondary font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                  Explore Paths <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-xl hover:shadow-lg transition-all border-b-4 border-transparent hover:border-sjcs-secondary">
              <span className="material-symbols-outlined text-4xl text-sjcs-secondary mb-8">psychology</span>
              <h3 className="text-xl font-bold font-headline mb-4">24/7 AI Assistance</h3>
              <p className="text-sjcs-on-surface-variant text-sm leading-relaxed">Our SJCS AI bot is trained on your specific curriculum to provide ethical, structured guidance.</p>
            </div>
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-xl hover:shadow-lg transition-all border-b-4 border-transparent hover:border-sjcs-primary">
              <span className="material-symbols-outlined text-4xl text-sjcs-primary mb-8">menu_book</span>
              <h3 className="text-xl font-bold font-headline mb-4">Scholastic Archive</h3>
              <p className="text-sjcs-on-surface-variant text-sm leading-relaxed">Direct access to thousands of academic journals, e-books, and SJCS-exclusive documents.</p>
            </div>
            <div className="md:col-span-2 bg-sjcs-surface-container-lowest p-10 rounded-xl flex items-center gap-12 group hover:shadow-lg transition-all border-b-4 border-transparent hover:border-sjcs-secondary">
              <div>
                <h3 className="text-2xl font-bold font-headline mb-4">Seamless Campus Sync</h3>
                <p className="text-sjcs-on-surface-variant leading-relaxed">Your digital work and physical classroom presence are perfectly synchronized.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Area */}
      <section className="max-w-4xl mx-auto px-8 mt-32 text-center">
        <div className="bg-sjcs-surface-container-lowest p-12 rounded-xl shadow-2xl shadow-slate-200/50">
          <div className="mb-10">
            <h2 className="text-2xl font-bold font-headline mb-2">Authenticated Login</h2>
            <p className="text-sm font-label uppercase tracking-widest text-sjcs-on-surface-variant/60">Secure Academic Portal</p>
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-sjcs-on-surface-variant mb-8">To access the LIS platform, you need to verify your identity first.</p>
            <Link to="/lis/identity" className="block w-full leadership-gradient text-white py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:shadow-sjcs-primary/30 transition-all text-center">
              Begin Verification
            </Link>
            <p className="text-center text-[10px] text-sjcs-on-surface-variant/60 font-medium mt-4">
              Already activated? <Link to="/lis/login" className="text-sjcs-secondary font-bold hover:underline">Login directly</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
