export default function ExamProgressPage() {
  return (
    <main className="pt-32 pb-20 px-8 max-w-4xl mx-auto min-h-screen">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Exam In Progress</span>
          <h1 className="font-headline text-3xl font-bold">AP Calculus Mock Exam</h1>
        </div>
        <div className="text-right">
          <p className="font-headline text-2xl font-bold text-sjcs-primary">45:30</p>
          <p className="text-[10px] uppercase tracking-widest text-sjcs-on-surface-variant">Time Remaining</p>
        </div>
      </header>

      <div className="w-full bg-sjcs-surface-container rounded-full h-2 mb-12">
        <div className="bg-sjcs-primary h-2 rounded-full transition-all" style={{ width: "35%" }}></div>
      </div>

      <div className="bg-sjcs-surface-container-lowest rounded-xl p-10 shadow-ambient mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant">Question 16 of 45</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">Flagged</span>
        </div>
        <h2 className="font-headline text-xl font-bold mb-8">
          Find the derivative of f(x) = 3x⁴ - 2x² + 7x - 1. Evaluate at x = 2.
        </h2>
        <div className="space-y-4">
          {["f'(2) = 82", "f'(2) = 96", "f'(2) = 103", "f'(2) = 88"].map((opt, i) => (
            <label key={i} className="flex items-center gap-4 p-4 rounded-xl bg-sjcs-surface-container-low hover:bg-sjcs-surface-container cursor-pointer transition-colors">
              <input type="radio" name="answer" className="w-4 h-4 accent-sjcs-primary" />
              <span className="font-medium">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-8 py-3 rounded-lg font-label text-xs font-bold tracking-widest uppercase">Previous</button>
        <button className="leadership-gradient text-white px-8 py-3 rounded-lg font-label text-xs font-bold tracking-widest uppercase shadow-lg">Next Question</button>
      </div>
    </main>
  );
}
