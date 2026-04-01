export default function MaterialsPage() {
  const materials = [
    { title: "Summa Theologica Vol. I", subject: "Theology", type: "ebook", grade: 11, icon: "menu_book" },
    { title: "AP Calculus BC Review", subject: "Mathematics", type: "worksheet", grade: 12, icon: "calculate" },
    { title: "Medieval History Sources", subject: "History", type: "ebook", grade: 10, icon: "history_edu" },
    { title: "Physics Lab Manual", subject: "Science", type: "worksheet", grade: 11, icon: "science" },
    { title: "Latin Grammar Exercises", subject: "Latin", type: "worksheet", grade: 9, icon: "translate" },
    { title: "AP Biology Practice Exam", subject: "Science", type: "exam", grade: 12, icon: "biotech" },
    { title: "Philosophy of Ethics", subject: "Philosophy", type: "ebook", grade: 10, icon: "psychology" },
    { title: "English Literature Anthology", subject: "Literature", type: "ebook", grade: 11, icon: "auto_stories" },
  ];

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Resource Center</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Scholastic <span className="text-sjcs-primary">Library</span></h1>
        <p className="mt-2 text-sjcs-on-surface-variant">Access e-books, worksheets, and exam prep materials for your grade level.</p>
      </header>

      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "E-Books", "Worksheets", "Exams"].map((filter) => (
          <button key={filter} className={`px-6 py-2 rounded-lg font-label text-xs font-bold uppercase tracking-wider transition-colors ${filter === "All" ? "leadership-gradient text-sjcs-on-primary" : "bg-sjcs-surface-container-highest text-sjcs-on-surface hover:bg-sjcs-surface-variant"}`}>
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {materials.map((m) => (
          <div key={m.title} className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient hover:shadow-lg transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <span className="material-symbols-outlined text-3xl text-sjcs-on-surface-variant group-hover:text-sjcs-primary transition-colors">{m.icon}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${m.type === "ebook" ? "bg-sjcs-secondary-fixed text-sjcs-on-secondary-fixed" : m.type === "exam" ? "bg-sjcs-primary-fixed text-sjcs-on-primary-fixed" : "bg-sjcs-surface-container text-sjcs-on-surface-variant"}`}>
                {m.type}
              </span>
            </div>
            <h3 className="font-headline font-bold mb-2">{m.title}</h3>
            <p className="text-xs text-sjcs-on-surface-variant mb-4">{m.subject} • Grade {m.grade}</p>
            <button className="text-sjcs-secondary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Access <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
