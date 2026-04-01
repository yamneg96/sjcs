export default function StudyHistoryPage() {
  const logs = [
    { subject: "Philosophy", question: "What is the Scholastic Method?", grade: "94%", date: "2 hours ago" },
    { subject: "History", question: "Causes of the Renaissance", grade: "88%", date: "Yesterday" },
    { subject: "Mathematics", question: "How to solve integrals by parts", grade: "91%", date: "2 days ago" },
    { subject: "Theology", question: "The Summa Theologica key arguments", grade: "96%", date: "3 days ago" },
  ];

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Academic Progress</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Study <span className="text-sjcs-primary">History</span></h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Sessions", value: "47", icon: "history", color: "text-sjcs-primary" },
          { label: "Study Hours", value: "62h", icon: "schedule", color: "text-sjcs-secondary" },
          { label: "Avg. Score", value: "92%", icon: "trending_up", color: "text-sjcs-secondary" },
          { label: "Current Streak", value: "5 Days", icon: "local_fire_department", color: "text-sjcs-tertiary" },
        ].map((stat) => (
          <div key={stat.label} className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient text-center">
            <span className={`material-symbols-outlined text-3xl ${stat.color} mb-3`}>{stat.icon}</span>
            <p className="font-headline text-3xl font-bold">{stat.value}</p>
            <p className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-widest mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-sjcs-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
        <div className="p-8 border-b border-sjcs-surface-container">
          <h2 className="font-headline text-xl font-bold">Recent Study Logs</h2>
        </div>
        <div className="divide-y divide-sjcs-surface-container">
          {logs.map((log, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-sjcs-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-sjcs-primary p-2 bg-sjcs-surface-container rounded-lg">history_edu</span>
                <div>
                  <p className="font-bold text-sm">{log.question}</p>
                  <p className="text-xs text-sjcs-on-surface-variant">{log.subject}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-headline font-bold text-sjcs-secondary">{log.grade}</p>
                <p className="text-[10px] text-sjcs-on-surface-variant/60 uppercase">{log.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
