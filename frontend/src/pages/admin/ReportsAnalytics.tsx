export default function ReportsAnalytics() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight text-sjcs-on-surface">Reports &amp; Analytics</h3>
          <p className="text-sjcs-on-surface-variant text-sm mt-1">Institutional academic performance and engagement monitoring.</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-sjcs-on-surface-variant">Grade Level</label>
            <select className="bg-sjcs-surface-container-lowest border-none rounded-lg text-xs font-medium py-2 px-3 focus:ring-1 focus:ring-sjcs-primary/20 shadow-sm">
              <option>All Grades</option>
              <option>Senior High School</option>
              <option>Junior High School</option>
              <option>Elementary</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-sjcs-on-surface-variant">Subject</label>
            <select className="bg-sjcs-surface-container-lowest border-none rounded-lg text-xs font-medium py-2 px-3 focus:ring-1 focus:ring-sjcs-primary/20 shadow-sm">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>Religious Education</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-sjcs-on-surface-variant">Time Range</label>
            <select className="bg-sjcs-surface-container-lowest border-none rounded-lg text-xs font-medium py-2 px-3 focus:ring-1 focus:ring-sjcs-primary/20 shadow-sm">
              <option>Academic Year 2023-24</option>
              <option>Last Quarter</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <button className="bg-sjcs-surface-container-highest self-end p-2.5 rounded-lg text-sjcs-on-surface hover:bg-sjcs-surface-dim transition-colors">
            <span className="material-symbols-outlined text-sm">file_download</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Analytics: Performance Distribution (Histogram) */}
        <div className="col-span-8 bg-sjcs-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-sjcs-on-surface">Performance Distribution</h4>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-sjcs-on-surface-variant"><span className="w-3 h-3 rounded-sm bg-sjcs-primary"></span> Grade ≥ 85%</span>
              <span className="flex items-center gap-1 text-xs text-sjcs-on-surface-variant"><span className="w-3 h-3 rounded-sm bg-sjcs-secondary"></span> Average Grade</span>
            </div>
          </div>
          
          {/* Histogram Mockup */}
          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-sjcs-surface-container pb-2">
            <div className="w-full bg-sjcs-primary/10 rounded-t h-[20%]"></div>
            <div className="w-full bg-sjcs-primary/20 rounded-t h-[35%]"></div>
            <div className="w-full bg-sjcs-primary/40 rounded-t h-[55%]"></div>
            <div className="w-full bg-sjcs-primary/60 rounded-t h-[75%]"></div>
            <div className="w-full bg-sjcs-primary rounded-t h-[95%]"></div>
            <div className="w-full bg-sjcs-primary/80 rounded-t h-[85%]"></div>
            <div className="w-full bg-sjcs-primary/60 rounded-t h-[60%]"></div>
            <div className="w-full bg-sjcs-primary/40 rounded-t h-[40%]"></div>
            <div className="w-full bg-sjcs-primary/20 rounded-t h-[25%]"></div>
            <div className="w-full bg-sjcs-primary/10 rounded-t h-[15%]"></div>
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-sjcs-on-surface-variant px-4 pt-3 uppercase tracking-tighter">
            <span>40-45</span><span>50-55</span><span>60-65</span><span>70-75</span><span>80-85</span><span>90-95</span><span>100</span>
          </div>
          <div className="mt-6 flex gap-8">
            <div className="flex flex-col">
              <span className="text-sjcs-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Median Score</span>
              <span className="text-2xl font-black text-sjcs-primary">87.4%</span>
            </div>
            <div className="flex flex-col border-l border-sjcs-surface-container pl-8">
              <span className="text-sjcs-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Standard Deviation</span>
              <span className="text-2xl font-black text-sjcs-secondary">4.21</span>
            </div>
            <div className="flex flex-col border-l border-sjcs-surface-container pl-8">
              <span className="text-sjcs-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Top Percentile</span>
              <span className="text-2xl font-black text-sjcs-tertiary">12%</span>
            </div>
          </div>
        </div>

        {/* Critical Monitoring: Weak Subjects (Bar) */}
        <div className="col-span-4 bg-sjcs-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
          <h4 className="text-lg font-bold text-sjcs-on-surface mb-6">Subject Weaknesses</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Advanced Algebra</span>
                <span className="text-sjcs-error font-bold">14% Decline</span>
              </div>
              <div className="w-full bg-sjcs-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-sjcs-error h-full" style={{width: '78%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Organic Chemistry</span>
                <span className="text-sjcs-error font-bold">8.2% Decline</span>
              </div>
              <div className="w-full bg-sjcs-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-sjcs-error/60 h-full" style={{width: '62%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>World History</span>
                <span className="text-sjcs-on-surface-variant font-bold">Stable</span>
              </div>
              <div className="w-full bg-sjcs-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-sjcs-surface-variant h-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>English Composition</span>
                <span className="text-sjcs-secondary font-bold">5.1% Growth</span>
              </div>
              <div className="w-full bg-sjcs-surface-container h-2 rounded-full overflow-hidden">
                <div className="bg-sjcs-secondary h-full" style={{width: '38%'}}></div>
              </div>
            </div>
          </div>
          <button className="w-full mt-10 py-3 text-xs font-bold uppercase tracking-widest text-sjcs-secondary hover:bg-sjcs-secondary/5 rounded-lg border border-sjcs-secondary/10 transition-colors">
            View curriculum reports
          </button>
        </div>

        {/* Trending: Study Engagement (Line Chart) */}
        <div className="col-span-12 bg-sjcs-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(25,28,29,0.04)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-lg font-bold text-sjcs-on-surface">Study Engagement Trends</h4>
              <p className="text-xs text-sjcs-on-surface-variant">Average portal activity hours per student per week</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sjcs-primary"></span>
                <span className="text-[10px] uppercase font-bold text-sjcs-on-surface-variant">Actual Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sjcs-secondary"></span>
                <span className="text-[10px] uppercase font-bold text-sjcs-on-surface-variant">Expected Target</span>
              </div>
            </div>
          </div>
          
          {/* SVG Line Chart Mockup */}
          <div className="relative h-48 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 100">
              {/* Background Grid */}
              <path d="M0 25 L1000 25 M0 50 L1000 50 M0 75 L1000 75" stroke="#edeeef" strokeWidth="1"></path>
              {/* Target Line */}
              <path d="M0 40 L100 38 L200 42 L300 40 L400 40 L500 35 L600 35 L700 38 L800 40 L900 42 L1000 40" fill="none" opacity="0.3" stroke="#005faf" strokeDasharray="4" strokeWidth="2"></path>
              {/* Actual Line */}
              <path d="M0 80 L100 70 L200 75 L300 50 L400 60 L500 30 L600 25 L700 28 L800 15 L900 20 L1000 10" fill="none" stroke="#af101a" strokeLinecap="round" strokeWidth="3"></path>
              {/* Area under line */}
              <path d="M0 80 L100 70 L200 75 L300 50 L400 60 L500 30 L600 25 L700 28 L800 15 L900 20 L1000 10 L1000 100 L0 100 Z" fill="url(#line-gradient)" opacity="0.1"></path>
              <defs>
                <linearGradient id="line-gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#af101a"></stop>
                  <stop offset="100%" stopColor="transparent"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-widest">
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </div>

        {/* High Density Data Table: Student Outliers */}
        <div className="col-span-12 bg-sjcs-surface-container-low rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(25,28,29,0.06)] mt-4">
          <div className="bg-sjcs-surface-container-highest px-6 py-4 flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-widest text-sjcs-on-surface">Attention Required: Student Performance Outliers</h4>
            <span className="text-[10px] bg-sjcs-error-container text-sjcs-on-error-container px-2 py-0.5 rounded font-bold">128 Students</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-sjcs-surface-container-lowest/50 sticky top-0">
              <tr className="border-b border-sjcs-surface-container">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-sjcs-on-surface-variant tracking-widest">Student Name</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-sjcs-on-surface-variant tracking-widest">Student ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-sjcs-on-surface-variant tracking-widest">GPA Trend</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-sjcs-on-surface-variant tracking-widest">Risk Level</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-sjcs-on-surface-variant tracking-widest">Last Action</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sjcs-surface-container">
              <tr className="bg-sjcs-surface-container-lowest hover:bg-sjcs-surface-container-high transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">MC</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-sjcs-on-surface">Maria Clara Santos</span>
                      <span className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-tighter">Grade 11 - STEM A</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-xs font-mono text-sjcs-on-surface-variant">SJ-2023-0941</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2 text-sjcs-error">
                    <span className="material-symbols-outlined text-sm">trending_down</span>
                    <span className="text-xs font-bold">-12.5%</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="px-2 py-1 rounded-full bg-sjcs-error-container text-sjcs-on-error-container text-[10px] font-bold uppercase tracking-wider">Critical</span>
                </td>
                <td className="px-6 py-3 text-xs text-sjcs-on-surface-variant">Counselor assigned (Jan 12)</td>
                <td className="px-6 py-3 text-right">
                  <button className="p-2 hover:bg-sjcs-surface-container rounded-full"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                </td>
              </tr>
              <tr className="bg-sjcs-surface-container-lowest hover:bg-sjcs-surface-container-high transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-sjcs-on-surface">Juan Dela Cruz</span>
                      <span className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-tighter">Grade 12 - HUMSS B</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-xs font-mono text-sjcs-on-surface-variant">SJ-2022-0112</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2 text-sjcs-error">
                    <span className="material-symbols-outlined text-sm">trending_down</span>
                    <span className="text-xs font-bold">-8.1%</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">High Risk</span>
                </td>
                <td className="px-6 py-3 text-xs text-sjcs-on-surface-variant">Notice sent to parents (Jan 15)</td>
                <td className="px-6 py-3 text-right">
                  <button className="p-2 hover:bg-sjcs-surface-container rounded-full"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                </td>
              </tr>
              <tr className="bg-sjcs-surface-container-lowest hover:bg-sjcs-surface-container-high transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">AL</div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-sjcs-on-surface">Angela Lopez</span>
                      <span className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-tighter">Grade 10 - Section Gold</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-xs font-mono text-sjcs-on-surface-variant">SJ-2024-0552</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2 text-sjcs-error">
                    <span className="material-symbols-outlined text-sm">trending_down</span>
                    <span className="text-xs font-bold">-4.5%</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider">Moderate</span>
                </td>
                <td className="px-6 py-3 text-xs text-sjcs-on-surface-variant">Pending internal review</td>
                <td className="px-6 py-3 text-right">
                  <button className="p-2 hover:bg-sjcs-surface-container rounded-full"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
