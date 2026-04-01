export default function AcademicManagement() {
  return (
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-sjcs-on-surface">Academic Management</h2>
          <p className="text-sjcs-on-surface-variant mt-1">Curriculum planning and teacher allocations for the 2024-2025 session.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Curriculum
          </button>
          <button className="leadership-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-sm">add</span>
            Quick Action
          </button>
        </div>
      </div>

      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-sjcs-primary/10 rounded-lg text-sjcs-primary">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+2 This Term</span>
          </div>
          <h3 className="text-2xl font-bold">24</h3>
          <p className="text-xs font-medium text-sjcs-on-surface-variant uppercase tracking-wider">Active Subjects</p>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-sjcs-secondary/10 rounded-lg text-sjcs-secondary">
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className="text-xs font-bold text-sjcs-on-surface-variant bg-slate-100 px-2 py-1 rounded">100% Filled</span>
          </div>
          <h3 className="text-2xl font-bold">42</h3>
          <p className="text-xs font-medium text-sjcs-on-surface-variant uppercase tracking-wider">Faculty Members</p>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-sjcs-tertiary/10 rounded-lg text-sjcs-tertiary">
              <span className="material-symbols-outlined">school</span>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Action Needed</span>
          </div>
          <h3 className="text-2xl font-bold">4</h3>
          <p className="text-xs font-medium text-sjcs-on-surface-variant uppercase tracking-wider">Grade Levels</p>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
              <span className="material-symbols-outlined">event_available</span>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">In Review</span>
          </div>
          <h3 className="text-2xl font-bold">92%</h3>
          <p className="text-xs font-medium text-sjcs-on-surface-variant uppercase tracking-wider">Course Coverage</p>
        </div>
      </div>

      {/* Main Interactive Area: Bento Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Grade Groups Section */}
        <section className="col-span-12 xl:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold tracking-tight border-l-4 border-sjcs-primary pl-3">Class Management</h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-sjcs-primary hover:underline">View All Sections</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class 9 Card */}
            <div className="group bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-sjcs-primary/5 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-sjcs-on-surface-variant uppercase">Foundation Year</span>
                  <h4 className="text-2xl font-black text-sjcs-on-surface mt-1">Grade 09</h4>
                </div>
                <span className="bg-sjcs-secondary/10 text-sjcs-secondary text-[10px] font-bold px-2 py-1 rounded">128 Students</span>
              </div>
              <div className="mt-6 space-y-3 relative z-10">
                <div className="flex items-center justify-between text-xs text-sjcs-on-surface-variant">
                  <span>Curriculum Progress</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sjcs-secondary h-full rounded-full w-[85%]"></div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center relative z-10">
                <button className="text-sjcs-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Manage Grade <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Class 10 Card */}
            <div className="group bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-sjcs-primary/5 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-sjcs-on-surface-variant uppercase">Intermediate Year</span>
                  <h4 className="text-2xl font-black text-sjcs-on-surface mt-1">Grade 10</h4>
                </div>
                <span className="bg-sjcs-secondary/10 text-sjcs-secondary text-[10px] font-bold px-2 py-1 rounded">142 Students</span>
              </div>
              <div className="mt-6 space-y-3 relative z-10">
                <div className="flex items-center justify-between text-xs text-sjcs-on-surface-variant">
                  <span>Curriculum Progress</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sjcs-secondary h-full rounded-full w-[92%]"></div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center relative z-10">
                <button className="text-sjcs-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Manage Grade <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subjects Management Section */}
          <div className="bg-sjcs-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold tracking-tight">Active Subjects &amp; Curriculum</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-sjcs-primary transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="bg-sjcs-primary text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Subject
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Subject Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Grade Allocation</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Primary Teacher</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">functions</span>
                        </div>
                        <span className="text-sm font-semibold">Advanced Mathematics</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">G11</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">G12</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-sjcs-on-surface">Dr. Richard Feynman</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Published
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sidebar: Actions & Insights */}
        <aside className="col-span-12 xl:col-span-4 space-y-8">
          <div className="bg-sjcs-surface-container-low p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Administrative Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white p-4 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-sjcs-primary hover:text-white group transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined p-2 bg-slate-50 rounded-lg group-hover:bg-white/20">assignment_ind</span>
                Assign Teachers to Grade
              </button>
              <button className="w-full bg-white p-4 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-sjcs-primary hover:text-white group transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined p-2 bg-slate-50 rounded-lg group-hover:bg-white/20">view_comfy</span>
                Map Subject to Curriculum
              </button>
              <button className="w-full bg-white p-4 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-sjcs-primary hover:text-white group transition-all duration-200 shadow-sm">
                <span className="material-symbols-outlined p-2 bg-slate-50 rounded-lg group-hover:bg-white/20">calendar_month</span>
                Schedule Final Examinations
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-2">Teacher Allocation</h3>
            <p className="text-slate-400 text-xs mb-6">3 teachers have been identified with exceeding workload for the next semester.</p>
            <button className="w-full bg-white text-slate-900 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors">Review Faculty Load</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
