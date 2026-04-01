export default function MaterialsManagement() {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Dashboard Header */}
      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-sjcs-on-surface tracking-tight">Materials &amp; RAG Management</h2>
        <p className="text-sjcs-on-surface-variant max-w-2xl">Manage the institutional knowledge base. Upload curriculum PDFs to train the SJCS AI models using Retrieval-Augmented Generation (RAG).</p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Panel (Glassmorphism Card) */}
        <div className="col-span-12 lg:col-span-4 bg-sjcs-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(25,28,29,0.04)] h-fit space-y-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sjcs-primary">cloud_upload</span>
            <h3 className="text-lg font-bold text-sjcs-on-surface">Ingest New Content</h3>
          </div>
          <div className="space-y-4">
            {/* File Drop Zone */}
            <div className="border-2 border-dashed border-sjcs-secondary/20 bg-sjcs-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-sjcs-secondary/5 transition-all">
              <span className="material-symbols-outlined text-4xl text-sjcs-secondary mb-3 group-hover:-translate-y-1 transition-transform">picture_as_pdf</span>
              <p className="text-sm font-semibold text-sjcs-on-surface">Click to upload PDF</p>
              <p className="text-[11px] text-sjcs-on-surface-variant mt-1">Maximum file size: 48MB</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant px-1">Subject Area</label>
                <select className="w-full bg-sjcs-surface-container border-none rounded-lg text-sm px-3 py-2.5 focus:ring-2 ring-sjcs-secondary/30">
                  <option>Mathematics</option>
                  <option>Science &amp; Physics</option>
                  <option>Theological Studies</option>
                  <option>Literature &amp; Arts</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant px-1">Grade Level</label>
                  <select className="w-full bg-sjcs-surface-container border-none rounded-lg text-sm px-3 py-2.5 focus:ring-2 ring-sjcs-secondary/30">
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant px-1">Material Type</label>
                  <select className="w-full bg-sjcs-surface-container border-none rounded-lg text-sm px-3 py-2.5 focus:ring-2 ring-sjcs-secondary/30">
                    <option>E-Book</option>
                    <option>Worksheet</option>
                    <option>Mock Exam</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="w-full leadership-gradient text-white font-bold py-3 rounded-lg shadow-lg shadow-sjcs-primary/10 flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">bolt</span>
              Start Ingestion
            </button>
          </div>
        </div>

        {/* RAG Status & Stats (Small Bento Boxes) */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 h-fit">
          <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-sjcs-tertiary">memory</span>
            <div className="mt-4">
              <p className="text-2xl font-black text-sjcs-on-surface">1.2k</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Total Vector Chunks</p>
            </div>
          </div>
          <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-sjcs-primary">data_usage</span>
            <div className="mt-4">
              <p className="text-2xl font-black text-sjcs-on-surface">94.2%</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Retrieval Accuracy</p>
            </div>
          </div>
          <div className="bg-sjcs-surface-container-lowest p-6 rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] flex flex-col justify-between border-b-4 border-sjcs-primary/20 hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-sjcs-secondary">pending_actions</span>
            <div className="mt-4">
              <p className="text-2xl font-black text-sjcs-on-surface">12</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Pending Processing</p>
            </div>
          </div>

          {/* Main Table Container */}
          <div className="col-span-1 sm:col-span-3 bg-sjcs-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(25,28,29,0.04)] overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-sjcs-surface-container">
              <h3 className="font-bold text-sjcs-on-surface">Knowledge Base Assets</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-[10px] font-bold bg-sjcs-surface-container hover:bg-sjcs-surface-container-high rounded text-sjcs-on-surface-variant transition-colors uppercase tracking-widest">Filter</button>
                <button className="px-3 py-1.5 text-[10px] font-bold bg-sjcs-surface-container hover:bg-sjcs-surface-container-high rounded text-sjcs-on-surface-variant transition-colors uppercase tracking-widest">Export CSV</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sjcs-surface-container-low">
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">File Name</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Metadata</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">RAG Chunks</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sjcs-surface-container">
                  {/* Row 1 */}
                  <tr className="hover:bg-sjcs-surface-container-high/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-700 bg-red-50 p-2 rounded-lg">description</span>
                        <div>
                          <p className="text-sm font-semibold text-sjcs-on-surface">Calculus_AB_Semester1.pdf</p>
                          <p className="text-[10px] text-sjcs-on-surface-variant">Uploaded Sep 12, 2023</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tighter">Math</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tighter">Grade 12</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-sjcs-on-surface tabular-nums">482 Chunks</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[11px] font-bold text-green-700 uppercase tracking-wide">Processed</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-sjcs-surface-variant rounded text-sjcs-on-surface-variant" title="Re-process"><span className="material-symbols-outlined text-lg">refresh</span></button>
                        <button className="p-1.5 hover:bg-sjcs-surface-variant rounded text-sjcs-on-surface-variant" title="View Chunks"><span className="material-symbols-outlined text-lg">schema</span></button>
                        <button className="p-1.5 hover:bg-sjcs-error-container hover:text-sjcs-error rounded transition-colors" title="Delete"><span className="material-symbols-outlined text-lg">delete</span></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-sjcs-surface-container flex items-center justify-between text-sjcs-on-surface-variant">
              <p className="text-[11px] font-medium uppercase tracking-widest">Showing 1 of 128 Materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        <div className="bg-sjcs-primary/5 rounded-xl p-6 border border-sjcs-primary/10 flex gap-4">
          <span className="material-symbols-outlined text-sjcs-primary text-3xl">lightbulb</span>
          <div>
            <h4 className="font-bold text-sjcs-primary mb-1">Vector Search Optimization</h4>
            <p className="text-xs text-sjcs-on-surface-variant leading-relaxed">Ensure PDFs have clear headings. Our RAG engine uses semantic structure to create more accurate chunks for the student-facing chatbots.</p>
          </div>
        </div>
        <div className="bg-sjcs-secondary/5 rounded-xl p-6 border border-sjcs-secondary/10 flex gap-4">
          <span className="material-symbols-outlined text-sjcs-secondary text-3xl">info</span>
          <div>
            <h4 className="font-bold text-sjcs-secondary mb-1">Bulk Ingestion Policy</h4>
            <p className="text-xs text-sjcs-on-surface-variant leading-relaxed">Ingestion occurs asynchronously. Larger textbooks may take up to 5 minutes to fully vectorize and replicate across the node clusters.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
