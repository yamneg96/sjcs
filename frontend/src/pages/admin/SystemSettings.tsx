export default function SystemSettings() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-sjcs-on-surface tracking-tight -ml-1">System Settings</h2>
        <p className="text-sjcs-on-surface-variant mt-1 font-medium">Configure global institutional parameters, access control, and platform intelligence.</p>
      </div>

      {/* Bento Grid Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: General & Notifications */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Settings Section */}
          <section className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-sjcs-primary/5 flex items-center justify-center text-sjcs-primary">
                <span className="material-symbols-outlined">settings_applications</span>
              </div>
              <h3 className="text-lg font-bold text-sjcs-on-surface">General Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant">Institutional Name</label>
                <input className="w-full bg-sjcs-surface-container border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-sjcs-primary/20" type="text" defaultValue="Saint Joseph Catholic School" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant">Academic Year</label>
                <select className="w-full bg-sjcs-surface-container border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-sjcs-primary/20" defaultValue="2023 - 2024 (Active)">
                  <option>2023 - 2024 (Active)</option>
                  <option>2024 - 2025 (Planning)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant">Timezone</label>
                <select className="w-full bg-sjcs-surface-container border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-sjcs-primary/20" defaultValue="Eastern Standard Time (EST)">
                  <option>Eastern Standard Time (EST)</option>
                  <option>Pacific Standard Time (PST)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant">Currency Symbol</label>
                <input className="w-full bg-sjcs-surface-container border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-sjcs-primary/20" type="text" defaultValue="USD ($)" />
              </div>
            </div>
          </section>

          {/* Role Permissions Section */}
          <section className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sjcs-secondary/5 flex items-center justify-center text-sjcs-secondary">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <h3 className="text-lg font-bold text-sjcs-on-surface">Role Permissions</h3>
              </div>
              <button className="text-sjcs-secondary text-sm font-bold flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-lg">add</span>
                New Role
              </button>
            </div>
            
            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant">
                    <th className="pb-4">User Role</th>
                    <th className="pb-4">Access Level</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                    <td className="py-4 px-2 rounded-l-lg">Super Admin</td>
                    <td className="py-4">System Wide</td>
                    <td className="py-4"><span className="bg-sjcs-primary/10 text-sjcs-primary px-2 py-1 rounded text-[10px] font-bold">LOCKED</span></td>
                    <td className="py-4 px-2 rounded-r-lg text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-sjcs-on-surface">more_vert</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                    <td className="py-4 px-2 rounded-l-lg">Department Head</td>
                    <td className="py-4">Academic Modules</td>
                    <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Active</span></td>
                    <td className="py-4 px-2 rounded-r-lg text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-sjcs-on-surface">edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                    <td className="py-4 px-2 rounded-l-lg">Finance Officer</td>
                    <td className="py-4">Payments &amp; Fees</td>
                    <td className="py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Active</span></td>
                    <td className="py-4 px-2 rounded-r-lg text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-sjcs-on-surface">edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: AI & Notifications */}
        <div className="space-y-8">
          {/* AI Configuration */}
          <section className="bg-gradient-to-br from-[#005faf] to-[#00799c] text-white rounded-xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">psychology</span>
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-lg font-bold">AI Core Configuration</h3>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">RAG Semantic Search</span>
                <div className="w-10 h-5 bg-white/20 rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-90">LIS Predictive Analytics</span>
                <div className="w-10 h-5 bg-white/20 rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <label className="text-[10px] uppercase font-bold opacity-60 tracking-widest block mb-2">LLM API Gateway</label>
                <div className="bg-white/10 rounded p-2 flex items-center justify-between">
                  <span className="text-xs font-mono truncate mr-2">•••••••••••••••••ae45f</span>
                  <span className="material-symbols-outlined text-xs">visibility</span>
                </div>
              </div>
              <button className="w-full bg-white text-sjcs-secondary py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all">
                Update Core Parameters
              </button>
            </div>
          </section>

          {/* Notification Settings */}
          <section className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-sjcs-tertiary/5 flex items-center justify-center text-sjcs-tertiary">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <h3 className="text-lg font-bold text-sjcs-on-surface">Notifications</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <input defaultChecked className="mt-1 rounded text-sjcs-primary border-sjcs-outline-variant focus:ring-sjcs-primary" type="checkbox" />
                <div>
                  <p className="text-sm font-bold text-sjcs-on-surface">System Alerts</p>
                  <p className="text-xs text-sjcs-on-surface-variant">Critical uptime and security alerts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input defaultChecked className="mt-1 rounded text-sjcs-primary border-sjcs-outline-variant focus:ring-sjcs-primary" type="checkbox" />
                <div>
                  <p className="text-sm font-bold text-sjcs-on-surface">Audit Logs</p>
                  <p className="text-xs text-sjcs-on-surface-variant">Daily summary of administrative changes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input className="mt-1 rounded text-sjcs-primary border-sjcs-outline-variant focus:ring-sjcs-primary" type="checkbox" />
                <div>
                  <p className="text-sm font-bold text-sjcs-on-surface">Student Reports</p>
                  <p className="text-xs text-sjcs-on-surface-variant">Notification on academic period end</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="mt-12 flex items-center justify-between border-t border-sjcs-outline-variant/20 pt-8 pb-4">
        <div className="flex items-center gap-2 text-sjcs-on-surface-variant">
          <span className="material-symbols-outlined text-sm">history</span>
          <span className="text-xs font-medium">Last system sync: Oct 24, 2023 • 14:32 PM</span>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-sjcs-surface-container-highest text-sjcs-on-surface rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
            Discard Changes
          </button>
          <button className="px-8 py-3 bg-gradient-to-br from-[#af101a] to-[#005faf] text-white rounded-lg text-sm font-bold shadow-lg shadow-sjcs-primary/20 hover:opacity-95 transition-all">
            Save Global Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
