export default function AIMonitoring() {
  return (
    <div className="p-8 flex-1 space-y-8">
      {/* Breadcrumbs & Headline */}
      <div>
        <nav className="flex text-[10px] uppercase tracking-widest font-bold text-sjcs-on-surface-variant mb-2 gap-2">
          <span>Admin</span>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-sjcs-primary">AI Monitoring</span>
        </nav>
        <h2 className="text-3xl font-black text-sjcs-on-surface tracking-tight">LIS Insights Dashboard</h2>
        <p className="text-sjcs-on-surface-variant mt-1 text-sm">Real-time surveillance of student-AI interactions and learning patterns.</p>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl border-l-4 border-sjcs-primary transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sjcs-primary bg-sjcs-primary/10 p-2 rounded-lg">psychology</span>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">+12.4%</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Total AI questions asked</p>
          <h3 className="text-3xl font-black text-sjcs-on-surface mt-1 tracking-tighter">42,891</h3>
          <div className="mt-4 w-full bg-sjcs-surface-container rounded-full h-1">
            <div className="bg-sjcs-primary h-1 rounded-full w-[75%] shadow-[0_0_8px_rgba(175,16,26,0.3)]"></div>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl border-l-4 border-sjcs-secondary transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sjcs-secondary bg-sjcs-secondary/10 p-2 rounded-lg">group</span>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">Live Now</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Active students today</p>
          <h3 className="text-3xl font-black text-sjcs-on-surface mt-1 tracking-tighter">1,248</h3>
          <div className="mt-4 w-full bg-sjcs-surface-container rounded-full h-1">
            <div className="bg-sjcs-secondary h-1 rounded-full w-[62%] shadow-[0_0_8px_rgba(0,95,175,0.3)]"></div>
          </div>
        </div>
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl border-l-4 border-sjcs-tertiary transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-sjcs-tertiary bg-sjcs-tertiary/10 p-2 rounded-lg">timer</span>
            <span className="text-sjcs-on-surface-variant text-xs font-bold bg-sjcs-surface-container px-2 py-1 rounded-full">Target: 15m</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Average session time</p>
          <h3 className="text-3xl font-black text-sjcs-on-surface mt-1 tracking-tighter">18m 42s</h3>
          <div className="mt-4 w-full bg-sjcs-surface-container rounded-full h-1">
            <div className="bg-sjcs-tertiary h-1 rounded-full w-[88%] shadow-[0_0_8px_rgba(0,95,123,0.3)]"></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Peak Usage Times */}
        <div className="lg:col-span-3 bg-sjcs-surface-container-lowest rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-sjcs-on-surface">Peak usage times</h4>
              <p className="text-xs text-sjcs-on-surface-variant">Hourly distribution of inquiries</p>
            </div>
            <select className="text-xs bg-sjcs-surface-container border-none rounded-lg font-medium py-1 pl-2 pr-8 focus:ring-0">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            <div className="flex-1 bg-sjcs-surface-container-high rounded-t-sm relative group h-[20%]">
              <div className="absolute inset-0 bg-sjcs-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">08:00</span>
            </div>
            <div className="flex-1 bg-sjcs-primary/80 rounded-t-sm relative group h-[45%]">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sjcs-primary">1.2k</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">10:00</span>
            </div>
            <div className="flex-1 bg-sjcs-primary rounded-t-sm relative group h-[90%]">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-sjcs-primary">2.4k</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">12:00</span>
            </div>
            <div className="flex-1 bg-sjcs-primary/80 rounded-t-sm relative group h-[60%]">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">14:00</span>
            </div>
            <div className="flex-1 bg-sjcs-primary rounded-t-sm relative group h-[75%]">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">16:00</span>
            </div>
            <div className="flex-1 bg-sjcs-surface-container-high rounded-t-sm relative group h-[30%]">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">18:00</span>
            </div>
            <div className="flex-1 bg-sjcs-surface-container-high rounded-t-sm relative group h-[15%]">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-sjcs-on-surface-variant">20:00</span>
            </div>
          </div>
        </div>

        {/* Questions per subject */}
        <div className="lg:col-span-2 bg-sjcs-surface-container-lowest rounded-xl p-6 flex flex-col">
          <h4 className="text-sm font-bold uppercase tracking-widest text-sjcs-on-surface mb-1">Questions per subject</h4>
          <p className="text-xs text-sjcs-on-surface-variant mb-6">Subject area engagement</p>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-40 h-40 rounded-full border-[12px] border-sjcs-surface-container relative" style={{background: 'conic-gradient(#af101a 0% 35%, #005faf 35% 65%, #005f7b 65% 85%, #e1e3e4 85% 100%)'}}>
              <div className="absolute inset-0 bg-white rounded-full m-[-2px]"></div>
              <div className="absolute inset-[15%] bg-sjcs-surface-container-lowest rounded-full shadow-inner flex flex-col items-center justify-center">
                <span className="text-xl font-black">100%</span>
                <span className="text-[8px] font-bold text-sjcs-on-surface-variant">TOTAL</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sjcs-primary"></div>
              <span className="text-xs font-medium">Theology (35%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sjcs-secondary"></div>
              <span className="text-xs font-medium">Mathematics (30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sjcs-tertiary"></div>
              <span className="text-xs font-medium">Sciences (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sjcs-surface-variant"></div>
              <span className="text-xs font-medium">Others (15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interactions Table */}
      <div className="bg-sjcs-surface-container-lowest rounded-xl overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center bg-sjcs-surface-container-low">
          <h4 className="text-sm font-bold uppercase tracking-widest text-sjcs-on-surface">Live Inquiry Stream</h4>
          <button className="text-[10px] font-bold uppercase tracking-widest text-sjcs-secondary flex items-center gap-1 hover:underline">
            View Full Logs <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-sjcs-surface-container-low border-b border-sjcs-surface-variant/20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Question asked</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Subject</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sjcs-surface-container">
              <tr className="hover:bg-sjcs-surface-container-high transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sjcs-surface-container flex items-center justify-center font-bold text-xs">JD</div>
                    <div>
                      <p className="text-xs font-bold text-sjcs-on-surface">John Dominic</p>
                      <p className="text-[10px] text-sjcs-on-surface-variant">Grade 11 - A</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-sjcs-on-surface-variant max-w-xs truncate">"Explain the significance of the Council of Trent..."</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-sjcs-primary/10 text-sjcs-primary">Theology</span>
                </td>
                <td className="px-6 py-4 text-[10px] font-medium text-sjcs-on-surface-variant">Today, 10:45 AM</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Resolved
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-sjcs-surface-container-high transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sjcs-surface-container flex items-center justify-center font-bold text-xs">SM</div>
                    <div>
                      <p className="text-xs font-bold text-sjcs-on-surface">Sophia Marie</p>
                      <p className="text-[10px] text-sjcs-on-surface-variant">Grade 9 - C</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-sjcs-on-surface-variant max-w-xs truncate">"Steps to solve quadratic equations using..."</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-sjcs-secondary/10 text-sjcs-secondary">Mathematics</span>
                </td>
                <td className="px-6 py-4 text-[10px] font-medium text-sjcs-on-surface-variant">Today, 10:42 AM</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Resolved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-sjcs-surface-container-low border-t border-sjcs-surface-variant/20 text-center">
          <button className="text-[10px] font-black uppercase tracking-[0.2em] text-sjcs-on-surface-variant hover:text-sjcs-primary transition-colors">Load more activity</button>
        </div>
      </div>

      {/* Contextual Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-sjcs-primary mb-4" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
            <h4 className="text-lg font-bold">Predictive Capacity Alert</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">Based on current usage velocity, AI demand is expected to spike by <span className="text-white font-bold">22%</span> during the upcoming finals week. Resource allocation has been automatically adjusted.</p>
            <button className="mt-6 px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">Adjust Limits</button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[160px]">monitoring</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl border border-sjcs-surface-container-high flex flex-col justify-center">
          <h4 className="text-sm font-bold uppercase tracking-widest text-sjcs-on-surface mb-4">Content Quality Score</h4>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Accuracy</span>
                <span>98.2%</span>
              </div>
              <div className="w-full h-2 bg-sjcs-surface-container rounded-full">
                <div className="w-[98%] h-full bg-green-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs font-bold mb-1 mt-4">
                <span>Relevance</span>
                <span>94.5%</span>
              </div>
              <div className="w-full h-2 bg-sjcs-surface-container rounded-full">
                <div className="w-[94%] h-full bg-sjcs-secondary rounded-full"></div>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-sjcs-primary/10 flex items-center justify-center flex-col text-sjcs-primary">
              <span className="text-2xl font-black">A+</span>
              <span className="text-[8px] font-bold uppercase tracking-tighter">EXCELLENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
