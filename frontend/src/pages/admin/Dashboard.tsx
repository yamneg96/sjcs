export default function AdminDashboard() {
  return (
    <section className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-sjcs-on-surface">Institutional Overview</h2>
          <p className="text-sjcs-on-surface-variant mt-1">Welcome back, Administrator. Here's what's happening at SJCS today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-sjcs-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Aug 2024 - Sept 2024
          </button>
        </div>
      </div>

      {/* Bento Grid - Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border-none flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Total Students</span>
            <div className="p-2 bg-sjcs-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-sjcs-primary text-xl">school</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold">1,240</h3>
            <span className="text-xs font-bold text-sjcs-tertiary flex items-center">+4.2%</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border-none flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Total Teachers</span>
            <div className="p-2 bg-sjcs-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-sjcs-secondary text-xl">co_present</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold">86</h3>
            <span className="text-xs font-bold text-sjcs-on-surface-variant">Stable</span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border-none flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Active LIS Users</span>
            <div className="p-2 bg-sjcs-tertiary/10 rounded-lg">
              <span className="material-symbols-outlined text-sjcs-tertiary text-xl">psychology</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold">982</h3>
            <span className="text-xs font-bold text-sjcs-tertiary flex items-center">+12.8%</span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border-none flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Monthly Revenue</span>
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="material-symbols-outlined text-green-700 text-xl">payments</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold">$42,500</h3>
            <span className="text-xs font-bold text-green-700 flex items-center">↑ 8%</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Trends Line Chart Placeholder */}
        <div className="lg:col-span-2 bg-sjcs-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-tight">Student Performance Trends</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-sjcs-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-sjcs-primary"></span> Actuals
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-sjcs-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-sjcs-secondary"></span> Target
              </span>
            </div>
          </div>
          <div className="h-64 w-full relative flex items-end justify-between px-2 pt-10">
            {/* Simulated Chart Grid */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-sjcs-on-surface"></div>
              <div className="border-b border-sjcs-on-surface"></div>
              <div className="border-b border-sjcs-on-surface"></div>
              <div className="border-b border-sjcs-on-surface"></div>
            </div>
            {/* Simulated Line Path (SVG) */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M0 160 Q 150 120 300 140 T 450 60 T 600 80 T 800 40" fill="none" stroke="#af101a" strokeWidth="3"></path>
              <path d="M0 150 Q 150 140 300 130 T 450 110 T 600 100 T 800 90" fill="none" stroke="#005faf" strokeDasharray="6 4" strokeWidth="3"></path>
            </svg>
            {/* Month Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] uppercase tracking-tighter font-bold text-sjcs-on-surface-variant mt-4 translate-y-6">
              <span>January</span><span>February</span><span>March</span><span>April</span><span>May</span><span>June</span>
            </div>
          </div>
        </div>

        {/* Quick Actions List */}
        <div className="bg-sjcs-surface-container-low p-8 rounded-xl flex flex-col gap-6">
          <h3 className="text-lg font-bold tracking-tight">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-sjcs-surface-container-lowest p-4 rounded-lg flex items-center justify-between group hover:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sjcs-surface-container flex items-center justify-center group-hover:bg-sjcs-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-sjcs-primary">upload_file</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Upload Material</p>
                  <p className="text-[10px] text-sjcs-on-surface-variant">Update curriculum files</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-sjcs-on-surface-variant text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button className="w-full bg-sjcs-surface-container-lowest p-4 rounded-lg flex items-center justify-between group hover:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sjcs-surface-container flex items-center justify-center group-hover:bg-sjcs-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-sjcs-secondary">person_add</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Add Student</p>
                  <p className="text-[10px] text-sjcs-on-surface-variant">Enroll new candidate</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-sjcs-on-surface-variant text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button className="w-full bg-sjcs-surface-container-lowest p-4 rounded-lg flex items-center justify-between group hover:bg-white transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sjcs-surface-container flex items-center justify-center group-hover:bg-sjcs-tertiary/10 transition-colors">
                  <span className="material-symbols-outlined text-sjcs-tertiary">analytics</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">View Reports</p>
                  <p className="text-[10px] text-sjcs-on-surface-variant">Detailed institutional audit</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-sjcs-on-surface-variant text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
          <div className="mt-auto pt-6 border-t border-sjcs-outline-variant/30">
            <p className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-3">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-green-700">All modules operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Grid - High Density Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Daily AI Usage Analytics - Bar Chart */}
        <div className="bg-sjcs-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold tracking-tight">AI Usage Analytics</h3>
              <p className="text-xs text-sjcs-on-surface-variant">Daily questions asked via LIS Portal</p>
            </div>
            <span className="text-xl font-black text-sjcs-secondary">3,420 <span className="text-[10px] font-bold text-sjcs-on-surface-variant">TOTAL</span></span>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-secondary rounded-t-lg transition-all" style={{ height: "45%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Mon</span>
            </div>
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-secondary rounded-t-lg transition-all" style={{ height: "65%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Tue</span>
            </div>
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-secondary rounded-t-lg transition-all" style={{ height: "85%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Wed</span>
            </div>
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-primary rounded-t-lg transition-all" style={{ height: "100%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Thu</span>
            </div>
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-secondary rounded-t-lg transition-all" style={{ height: "75%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Fri</span>
            </div>
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-secondary rounded-t-lg transition-all" style={{ height: "40%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Sat</span>
            </div>
            <div className="w-full bg-sjcs-surface-container rounded-t-lg relative group">
              <div className="absolute bottom-0 w-full bg-sjcs-secondary rounded-t-lg transition-all" style={{ height: "30%" }}></div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Sun</span>
            </div>
          </div>
        </div>

        {/* Study Time Analytics - Area Chart */}
        <div className="bg-sjcs-surface-container-lowest p-8 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Study Time Distribution</h3>
              <p className="text-xs text-sjcs-on-surface-variant">Average student platform engagement</p>
            </div>
            <div className="flex -space-x-2">
              <img alt="User profile" className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://api.dicebear.com/7.x/notionists/svg?seed=Student1" />
              <img alt="User profile" className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://api.dicebear.com/7.x/notionists/svg?seed=Student2" />
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold">+86</div>
            </div>
          </div>
          <div className="relative h-48 w-full overflow-hidden">
            {/* Area Chart Simulation */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#005faf" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#005faf" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0 80 Q 20 60 40 70 T 60 40 T 80 50 T 100 20 V 100 H 0 Z" fill="url(#areaGradient)"></path>
              <path d="M0 80 Q 20 60 40 70 T 60 40 T 80 50 T 100 20" fill="none" stroke="#005faf" strokeWidth="2"></path>
            </svg>
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-2 text-[10px] font-bold text-sjcs-on-surface-variant">
              <span>0h</span><span>4h</span><span>8h</span><span>12h</span><span>16h</span><span>20h</span><span>24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
