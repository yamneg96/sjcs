export default function UserManagement() {
  return (
    <div className="p-8 space-y-8">
      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant/60">
            <span>Management</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-sjcs-primary">User Directory</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-sjcs-on-surface">User Management</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-sjcs-surface-container-highest text-sjcs-on-surface rounded-lg text-sm font-semibold hover:bg-sjcs-surface-variant transition-all">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export Data
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 leadership-gradient text-sjcs-on-primary rounded-lg text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Quick Action
          </button>
        </div>
      </div>

      {/* Bento Stats Grid (Mini) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-sjcs-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] space-y-3 border-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-sjcs-primary/10 text-sjcs-primary rounded-lg">
              <span className="material-symbols-outlined">groups</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12%</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-sjcs-on-surface-variant/70">Total Users</p>
            <h4 className="text-2xl font-black text-sjcs-on-surface">1,284</h4>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] space-y-3 border-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-sjcs-secondary/10 text-sjcs-secondary rounded-lg">
              <span className="material-symbols-outlined">school</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+4%</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-sjcs-on-surface-variant/70">Active Students</p>
            <h4 className="text-2xl font-black text-sjcs-on-surface">942</h4>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] space-y-3 border-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-sjcs-tertiary/10 text-sjcs-tertiary rounded-lg">
              <span className="material-symbols-outlined">co_present</span>
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">0%</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-sjcs-on-surface-variant/70">Faculty Staff</p>
            <h4 className="text-2xl font-black text-sjcs-on-surface">86</h4>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-5 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] space-y-3 border-none hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined">pending</span>
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">High</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-sjcs-on-surface-variant/70">Pending Invites</p>
            <h4 className="text-2xl font-black text-sjcs-on-surface">15</h4>
          </div>
        </div>
      </div>

      {/* Table Controls Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex p-1 bg-sjcs-surface-container-low rounded-lg w-fit">
            <button className="px-6 py-1.5 bg-sjcs-surface-container-lowest text-sjcs-primary text-xs font-bold uppercase tracking-widest rounded shadow-sm transition-all">All Users</button>
            <button className="px-6 py-1.5 text-sjcs-on-surface-variant/60 text-xs font-bold uppercase tracking-widest hover:text-sjcs-on-surface transition-all">Students</button>
            <button className="px-6 py-1.5 text-sjcs-on-surface-variant/60 text-xs font-bold uppercase tracking-widest hover:text-sjcs-on-surface transition-all">Teachers</button>
            <button className="px-6 py-1.5 text-sjcs-on-surface-variant/60 text-xs font-bold uppercase tracking-widest hover:text-sjcs-on-surface transition-all">Parents</button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant hover:text-sjcs-on-surface bg-sjcs-surface-container-low rounded-lg transition-all">
              <span className="material-symbols-outlined text-base">filter_list</span>
              Advanced Filter
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-sjcs-error hover:bg-sjcs-error/5 bg-transparent rounded-lg transition-all opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-base">delete</span>
              Bulk Delete
            </button>
          </div>
        </div>

        {/* High-Density Data Table */}
        <div className="bg-sjcs-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sjcs-surface-container-low/50 backdrop-blur-sm border-b border-sjcs-outline-variant/10">
                  <th className="p-4 w-12">
                    <input className="rounded border-sjcs-outline-variant text-sjcs-primary focus:ring-sjcs-primary" type="checkbox" />
                  </th>
                  <th className="p-4 uppercase tracking-wider text-sjcs-on-surface-variant font-bold text-[10px]">Name</th>
                  <th className="p-4 uppercase tracking-wider text-sjcs-on-surface-variant font-bold text-[10px]">Role</th>
                  <th className="p-4 uppercase tracking-wider text-sjcs-on-surface-variant font-bold text-[10px]">Grade / Department</th>
                  <th className="p-4 uppercase tracking-wider text-sjcs-on-surface-variant font-bold text-[10px]">Status</th>
                  <th className="p-4 uppercase tracking-wider text-sjcs-on-surface-variant font-bold text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sjcs-outline-variant/10">
                {/* Simulated Row */}
                <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                  <td className="p-4">
                    <input className="rounded border-sjcs-outline-variant text-sjcs-primary focus:ring-sjcs-primary" type="checkbox" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sjcs-surface-container-high flex items-center justify-center font-bold text-sjcs-primary text-sm">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-bold text-sjcs-on-surface">Julianna Drant</p>
                        <p className="text-[11px] text-sjcs-on-surface-variant/70">j.drant@sjcs.edu</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-sjcs-secondary/10 text-sjcs-secondary text-[10px] font-bold uppercase tracking-wider">Student</span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-medium text-sjcs-on-surface">Grade 11-B</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-sjcs-on-surface-variant hover:text-sjcs-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="p-2 text-sjcs-on-surface-variant hover:text-sjcs-secondary transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between p-4 bg-sjcs-surface-container-low/30 border-t border-sjcs-outline-variant/10">
            <p className="text-xs text-sjcs-on-surface-variant font-medium">Showing 1 to 1 of 1,284 entries</p>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-sjcs-surface-container-high transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-sjcs-primary text-white text-xs font-bold">1</button>
              </div>
              <button className="p-2 rounded-lg hover:bg-sjcs-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
