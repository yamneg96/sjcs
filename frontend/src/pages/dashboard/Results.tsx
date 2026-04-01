export default function ResultsPage() {
  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Assessment Results</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Exam <span className="text-sjcs-primary">Results</span></h1>
      </header>

      <div className="max-w-3xl mx-auto">
        <div className="bg-sjcs-surface-container-lowest rounded-xl p-12 shadow-ambient text-center mb-8">
          <div className="w-32 h-32 rounded-full leadership-gradient mx-auto mb-6 flex items-center justify-center">
            <span className="text-sjcs-on-primary font-headline text-4xl font-black">94%</span>
          </div>
          <h2 className="font-headline text-2xl font-bold mb-2">Excellent Performance!</h2>
          <p className="text-sjcs-on-surface-variant">AP Calculus Mock Exam — Completed on March 30, 2024</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Correct", value: "42/45", color: "text-sjcs-secondary" },
            { label: "Time Used", value: "62 min", color: "text-sjcs-secondary" },
            { label: "Percentile", value: "Top 5%", color: "text-sjcs-primary" },
          ].map((s) => (
            <div key={s.label} className="bg-sjcs-surface-container-lowest rounded-xl p-6 text-center shadow-ambient">
              <p className={`font-headline text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-widest mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient">
          <h3 className="font-headline text-lg font-bold mb-6">Subject Breakdown</h3>
          <div className="space-y-6">
            {[
              { topic: "Derivatives", score: 95, total: 10 },
              { topic: "Integrals", score: 90, total: 12 },
              { topic: "Limits", score: 100, total: 8 },
              { topic: "Applications", score: 87, total: 15 },
            ].map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-sm">{t.topic}</span>
                  <span className="text-sm text-sjcs-on-surface-variant">{t.score}% ({t.total} questions)</span>
                </div>
                <div className="w-full bg-sjcs-surface-container rounded-full h-2">
                  <div className="bg-sjcs-primary h-2 rounded-full" style={{ width: `${t.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
