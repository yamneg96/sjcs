export default function MockExamsPage() {
  const exams = [
    { subject: "Mathematics", title: "AP Calculus Mock Exam", duration: "90 min", questions: 45, difficulty: "Advanced", color: "border-sjcs-primary" },
    { subject: "History", title: "Medieval History Assessment", duration: "60 min", questions: 30, difficulty: "Intermediate", color: "border-sjcs-secondary" },
    { subject: "Theology", title: "Catholic Social Teaching Quiz", duration: "30 min", questions: 20, difficulty: "Standard", color: "border-sjcs-tertiary" },
    { subject: "Science", title: "AP Biology Practice Test", duration: "90 min", questions: 50, difficulty: "Advanced", color: "border-sjcs-primary" },
    { subject: "Latin", title: "Latin Grammar Assessment", duration: "45 min", questions: 25, difficulty: "Intermediate", color: "border-sjcs-secondary" },
    { subject: "Philosophy", title: "Ethics & Logic Exam", duration: "60 min", questions: 35, difficulty: "Advanced", color: "border-sjcs-tertiary" },
  ];

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Assessment Center</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Mock <span className="text-sjcs-primary">Exams</span></h1>
        <p className="mt-2 text-sjcs-on-surface-variant">Practice with curriculum-aligned assessments to prepare for your examinations.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {exams.map((exam) => (
          <div key={exam.title} className={`bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient border-b-4 ${exam.color} hover:shadow-lg transition-shadow group`}>
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant/60">{exam.subject}</span>
              <span className="px-3 py-1 bg-sjcs-surface-container rounded-full text-[10px] font-bold uppercase">{exam.difficulty}</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">{exam.title}</h3>
            <div className="flex items-center gap-4 text-xs text-sjcs-on-surface-variant mb-8">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {exam.duration}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">quiz</span> {exam.questions} Qs</span>
            </div>
            <button className="w-full bg-sjcs-on-surface text-background py-3 rounded-lg font-label text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-sjcs-secondary transition-colors">
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
