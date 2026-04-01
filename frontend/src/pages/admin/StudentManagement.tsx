export default function StudentManagement() {
  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-sjcs-on-surface mb-1">Student Management</h2>
          <nav className="flex text-sm text-sjcs-on-surface-variant font-medium">
            <span className="hover:text-sjcs-primary cursor-pointer">Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-sjcs-primary">Student Registry</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-sjcs-surface-container-highest text-sjcs-on-surface text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined text-lg">upload_file</span>
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 leadership-gradient text-white text-sm font-semibold rounded-lg shadow-md hover:opacity-90 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Student Manually
          </button>
        </div>
      </div>

      {/* Dashboard Stats Tonal Shift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2">Total Students</p>
          <h3 className="text-2xl font-black text-sjcs-on-surface">1,248</h3>
          <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12% vs last year</span>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2">Active Now</p>
          <h3 className="text-2xl font-black text-sjcs-on-surface">892</h3>
          <div className="mt-2 flex items-center gap-1 text-sjcs-on-surface-variant text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Portal Activity (High)</span>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2">Avg Attendance</p>
          <h3 className="text-2xl font-black text-sjcs-on-surface">96.4%</h3>
          <div className="mt-2 flex items-center gap-1 text-sjcs-secondary text-xs font-bold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Institutional Target Met</span>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2">Pending Fees</p>
          <h3 className="text-2xl font-black text-sjcs-on-surface">14</h3>
          <div className="mt-2 flex items-center gap-1 text-sjcs-error text-xs font-bold">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>Requires Attention</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-sjcs-surface-container-low rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(25,28,29,0.06)]">
        {/* Table Filters */}
        <div className="p-6 bg-sjcs-surface-container-lowest flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <select className="bg-slate-50 border-none rounded-lg text-sm font-semibold px-4 py-2 pr-10 focus:ring-2 focus:ring-sjcs-primary/20">
              <option>All Grades</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
              <option>Grade 12</option>
            </select>
            <select className="bg-slate-50 border-none rounded-lg text-sm font-semibold px-4 py-2 pr-10 focus:ring-2 focus:ring-sjcs-primary/20">
              <option>Status: All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </div>
          <div className="text-sjcs-on-surface-variant text-sm font-medium">
            Showing <span className="text-sjcs-on-surface font-bold">1-1</span> of 1,248 students
          </div>
        </div>

        {/* Main Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-4 text-sjcs-on-surface-variant uppercase tracking-widest font-bold text-[11px]">Full Name</th>
                <th className="px-6 py-4 text-sjcs-on-surface-variant uppercase tracking-widest font-bold text-[11px]">Student ID</th>
                <th className="px-6 py-4 text-sjcs-on-surface-variant uppercase tracking-widest font-bold text-[11px]">Grade</th>
                <th className="px-6 py-4 text-sjcs-on-surface-variant uppercase tracking-widest font-bold text-[11px]">Login Status</th>
                <th className="px-6 py-4 text-sjcs-on-surface-variant uppercase tracking-widest font-bold text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-sjcs-surface-container-lowest divide-y divide-slate-50">
              {/* Row 1 */}
              <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sjcs-primary/10 text-sjcs-primary flex items-center justify-center font-bold text-sm">
                      AM
                    </div>
                    <div>
                      <p className="text-sm font-bold text-sjcs-on-surface group-hover:text-sjcs-primary transition-colors">Alexander Murphy</p>
                      <p className="text-[11px] text-sjcs-on-surface-variant">murphy.a@sjcs.edu</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold text-sjcs-on-surface-variant bg-slate-100 px-2 py-1 rounded">SJCS-8842</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-sjcs-on-surface">Grade 11</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-semibold text-emerald-700">Active</span>
                  </div>
                  <p className="text-[10px] text-sjcs-on-surface-variant mt-0.5">Online now</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-sjcs-secondary transition-all" title="View Profile">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-sjcs-primary transition-all" title="Reset Account">
                      <span className="material-symbols-outlined text-lg">lock_reset</span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-sjcs-on-surface-variant transition-all">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Contextual Help / System Status Tonal Wash */}
      <div className="bg-sjcs-primary/5 p-6 rounded-xl border border-sjcs-primary/10 flex items-start gap-4">
        <span className="material-symbols-outlined text-sjcs-primary mt-1">info</span>
        <div>
          <h4 className="text-sm font-bold text-sjcs-primary uppercase tracking-tight">Institutional Note</h4>
          <p className="text-sm text-sjcs-on-surface-variant leading-relaxed">
            The student registry is synchronized daily with the National Academic Database. Changes to student IDs or legal names must be accompanied by verified documentation through the System Settings &gt; Compliance module.
          </p>
        </div>
      </div>
    </div>
  );
}
