export default function PaymentsFinance() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight text-sjcs-on-surface">Payments &amp; Finance</h1>
          <p className="text-sjcs-on-surface-variant font-body">Institutional fiscal overview and student ledger management.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-sjcs-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
          <button className="leadership-gradient text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md hover:opacity-95 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            New Payment
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl">account_balance_wallet</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2">Total Revenue (MTD)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-headline font-black text-sjcs-on-surface">$284,550.00</h3>
            <span className="text-sjcs-primary font-bold text-xs flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              12.5%
            </span>
          </div>
          <div className="mt-4 w-full bg-sjcs-surface-container rounded-full h-1">
            <div className="bg-sjcs-primary h-1 rounded-full" style={{width: '78%'}}></div>
          </div>
          <p className="mt-2 text-[10px] text-sjcs-on-surface-variant font-medium">78% of projected monthly goal reached</p>
        </div>
        {/* Pending Payments */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl">schedule</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2">Pending Payments</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-headline font-black text-sjcs-secondary">$42,120.00</h3>
            <span className="text-sjcs-on-surface-variant text-xs font-medium">42 Students</span>
          </div>
          <div className="mt-4 flex gap-1">
            <div className="h-1 flex-1 bg-sjcs-secondary rounded-full"></div>
            <div className="h-1 flex-1 bg-sjcs-secondary rounded-full"></div>
            <div className="h-1 flex-1 bg-sjcs-surface-container rounded-full"></div>
            <div className="h-1 flex-1 bg-sjcs-surface-container rounded-full"></div>
          </div>
          <p className="mt-2 text-[10px] text-sjcs-on-surface-variant font-medium">Standard collection cycle: 14 days remaining</p>
        </div>
        {/* Overdue Payments */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] border border-sjcs-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl">error</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-sjcs-on-surface-variant mb-2 text-sjcs-error">Overdue Payments</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-headline font-black text-sjcs-error">$8,900.00</h3>
            <span className="bg-sjcs-error-container text-sjcs-on-error-container text-[10px] px-2 py-0.5 rounded font-bold">CRITICAL</span>
          </div>
          <div className="mt-4 flex -space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">JD</div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">MS</div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">AR</div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-sjcs-surface-container-highest text-[10px] font-bold">+9</div>
          </div>
          <p className="mt-2 text-[10px] text-sjcs-on-surface-variant font-medium">Requires immediate administrative outreach</p>
        </div>
      </div>

      {/* Financial Ledger Table Section */}
      <section className="bg-sjcs-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] overflow-hidden">
        <div className="p-6 border-b border-sjcs-surface-container flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <h2 className="text-lg font-headline font-bold text-sjcs-on-surface">Recent Student Transactions</h2>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-sjcs-on-surface-variant px-3 py-1.5 rounded-md hover:bg-sjcs-surface-container-low transition-colors">All</button>
            <button className="text-xs font-bold text-sjcs-primary px-3 py-1.5 rounded-md bg-sjcs-primary/5">Overdue</button>
            <button className="text-xs font-bold text-sjcs-on-surface-variant px-3 py-1.5 rounded-md hover:bg-sjcs-surface-container-low transition-colors">Paid</button>
            <div className="w-[1px] bg-sjcs-outline-variant/30 h-6 mx-1"></div>
            <button className="material-symbols-outlined text-sjcs-on-surface-variant">filter_list</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sjcs-surface-container-low/50">
                <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Student Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sjcs-surface-container/30">
              {/* Row 1 */}
              <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sjcs-surface-container flex items-center justify-center font-bold text-sjcs-secondary">AH</div>
                    <div>
                      <p className="text-sm font-bold text-sjcs-on-surface leading-none">Alexander Hamilton</p>
                      <p className="text-[10px] text-sjcs-on-surface-variant mt-1">Grade 11 - Science A</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-headline font-semibold text-sm">$1,250.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    PAID
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-sjcs-on-surface-variant">Oct 12, 2023</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded hover:bg-sjcs-surface-container-highest text-sjcs-on-surface-variant" title="View Receipt">
                      <span className="material-symbols-outlined text-lg">receipt</span>
                    </button>
                    <button className="p-1.5 rounded hover:bg-sjcs-surface-container-highest text-sjcs-on-surface-variant" title="More Options">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-sjcs-surface-container-high transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sjcs-surface-container flex items-center justify-center font-bold text-sjcs-primary">EL</div>
                    <div>
                      <p className="text-sm font-bold text-sjcs-on-surface leading-none">Elizabeth Lavenza</p>
                      <p className="text-[10px] text-sjcs-on-surface-variant mt-1">Grade 9 - Humanities</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-headline font-semibold text-sm">$840.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    PENDING
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-sjcs-on-surface-variant">Oct 28, 2023</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-sjcs-primary/10 text-sjcs-primary px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-sjcs-primary hover:text-white transition-all">Mark as Paid</button>
                    <button className="p-1.5 rounded hover:bg-sjcs-surface-container-highest text-sjcs-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Secondary Insight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods Distribution */}
        <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
          <h3 className="text-md font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sjcs-secondary">pie_chart</span>
            Revenue by Channel
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold w-24">Bank Transfer</span>
              <div className="flex-1 h-3 bg-sjcs-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-sjcs-secondary w-[65%]"></div>
              </div>
              <span className="text-xs font-headline font-bold">65%</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold w-24">Credit Card</span>
              <div className="flex-1 h-3 bg-sjcs-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-sjcs-primary w-[25%]"></div>
              </div>
              <span className="text-xs font-headline font-bold">25%</span>
            </div>
          </div>
        </div>

        {/* Financial Health Alert Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-sjcs-primary-fixed-dim">verified</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Health Check</span>
            </div>
            <h4 className="text-xl font-headline font-bold mb-2">Q4 Collection Target: On Track</h4>
            <p className="text-slate-400 text-xs mb-6 max-w-xs">Saint Joseph School is currently 14% ahead of last year's collection velocity for the same period.</p>
            <div className="flex gap-4">
              <div className="bg-white/10 rounded-lg p-3 flex-1 backdrop-blur-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Retention Rate</p>
                <p className="text-lg font-black">94.2%</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 flex-1 backdrop-blur-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Avg Pay Cycle</p>
                <p className="text-lg font-black">4.2 Days</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <span className="material-symbols-outlined text-[12rem]">account_balance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
