export default function TeacherManagement() {
  return (
    <div className="p-8 flex-1">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-sjcs-on-surface mb-2">Teacher Management</h2>
          <p className="text-sjcs-on-surface-variant font-medium">Coordinate faculty assignments and administrative oversight across all academic departments.</p>
        </div>
        <button className="leadership-gradient text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-lg">person_add</span>
          Onboard New Faculty
        </button>
      </div>

      {/* Dashboard Stats Tonal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border border-sjcs-outline-variant/10 hover:shadow-md transition-shadow">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Faculty</p>
          <p className="text-3xl font-black text-sjcs-on-surface">142</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-sjcs-primary font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+4 this semester</span>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border border-sjcs-outline-variant/10 hover:shadow-md transition-shadow">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Active Classes</p>
          <p className="text-3xl font-black text-sjcs-on-surface">86</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-sjcs-secondary font-bold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Full capacity</span>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border border-sjcs-outline-variant/10 hover:shadow-md transition-shadow">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Pending Approvals</p>
          <p className="text-3xl font-black text-sjcs-primary">07</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-sjcs-on-surface-variant font-bold">
            <span className="material-symbols-outlined text-sm">hourglass_empty</span>
            <span>Requiring action</span>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-sm border border-sjcs-outline-variant/10 hover:shadow-md transition-shadow">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Subjects Covered</p>
          <p className="text-3xl font-black text-sjcs-on-surface">32</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-sjcs-tertiary font-bold">
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            <span>Across 8 departments</span>
          </div>
        </div>
      </div>

      {/* Teacher List Table */}
      <div className="bg-sjcs-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-sjcs-surface-container-low/30 backdrop-blur-sm">
          <h3 className="font-bold text-sjcs-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-sjcs-primary">list</span>
            Faculty Directory
          </h3>
          <div className="flex gap-2">
            <button className="bg-sjcs-surface-container-highest px-4 py-1.5 rounded-lg text-xs font-bold text-sjcs-on-surface hover:bg-slate-200 transition-colors">Filter Dept.</button>
            <button className="bg-sjcs-surface-container-highest px-4 py-1.5 rounded-lg text-xs font-bold text-sjcs-on-surface hover:bg-slate-200 transition-colors">Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sjcs-surface-container-low/50">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Teacher</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Specialization</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Assigned Subjects</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Responsibilities</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sjcs-primary/10 flex items-center justify-center text-sjcs-primary font-bold text-sm">JS</div>
                    <div>
                      <p className="font-bold text-sjcs-on-surface leading-tight">James Sterling</p>
                      <p className="text-xs text-sjcs-on-surface-variant font-medium">ID: #T829-21</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-sjcs-secondary/10 text-sjcs-secondary text-[10px] font-black uppercase rounded-full">Mathematics</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-sjcs-on-surface-variant text-[10px] font-bold rounded">Calculus II</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-sjcs-on-surface-variant text-[10px] font-bold rounded">Linear Algebra</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-emerald-700">Active</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs font-medium text-sjcs-on-surface">Head of Math Club</p>
                </td>
                <td className="px-6 py-5 text-right space-x-2">
                  <button className="text-sjcs-secondary hover:underline text-xs font-bold transition-all">Assign</button>
                  <button className="text-slate-400 hover:text-sjcs-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Focus Mode: Quick Department Overview */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-sjcs-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-sjcs-secondary">insights</span>
          Departmental Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-80">
          <div className="col-span-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative shadow-xl">
            <div className="relative z-10">
              <h4 className="text-white text-2xl font-black mb-2 leading-tight">Faculty Distribution &amp; Capacity</h4>
              <p className="text-slate-400 text-sm max-w-md">Real-time analysis of teacher-to-student ratios across core academic divisions.</p>
            </div>
            <div className="flex items-end gap-6 relative z-10 mt-8 md:mt-0">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold text-white uppercase tracking-widest mb-2">
                  <span>STEM Division</span>
                  <span>92% Loaded</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sjcs-primary w-[92%]"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold text-white uppercase tracking-widest mb-2">
                  <span>Liberal Arts</span>
                  <span>65% Loaded</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sjcs-secondary w-[65%]"></div>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sjcs-primary/20 blur-[100px] rounded-full"></div>
          </div>
          <div className="col-span-4 bg-sjcs-surface-container-high rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-inner border border-white/50">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 text-sjcs-primary">
              <span className="material-symbols-outlined text-3xl">assignment_ind</span>
            </div>
            <h4 className="font-bold text-sjcs-on-surface mb-2">Need to re-assign?</h4>
            <p className="text-xs text-sjcs-on-surface-variant mb-6 px-4">Open the Subject Assignment wizard to redistribute workload across available staff.</p>
            <button className="w-full bg-sjcs-on-surface text-white py-3 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">Launch Subject Wizard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
