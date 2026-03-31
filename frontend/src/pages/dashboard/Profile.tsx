import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
  const { student } = useAuthStore();

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Student Profile</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">My <span className="text-sjcs-primary">Profile</span></h1>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="bg-sjcs-surface-container-lowest rounded-xl overflow-hidden shadow-ambient mb-8">
          <div className="h-32 leadership-gradient"></div>
          <div className="px-10 pb-10 -mt-12">
            <div className="w-24 h-24 rounded-full bg-sjcs-surface-container-highest border-4 border-white flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-sjcs-on-surface-variant">person</span>
            </div>
            <h2 className="font-headline text-2xl font-bold">{student?.fullName || "Student Name"}</h2>
            <p className="text-sjcs-on-surface-variant">Grade {student?.grade || "—"} • {student?.studentId || "SJCS000"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient">
            <h3 className="font-headline font-bold mb-6">Academic Overview</h3>
            <div className="space-y-4">
              {[
                { label: "GPA", value: "3.85 / 4.0" },
                { label: "Rank", value: "12 / 186" },
                { label: "Credits Earned", value: "48" },
                { label: "Honor Roll", value: "5 Semesters" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-3 border-b border-sjcs-surface-container last:border-none">
                  <span className="text-sm text-sjcs-on-surface-variant">{item.label}</span>
                  <span className="font-bold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-8 shadow-ambient">
            <h3 className="font-headline font-bold mb-6">Enrolled Courses</h3>
            <div className="space-y-4">
              {["AP Calculus BC", "Medieval History", "Philosophy 101", "Catholic Theology III", "AP Biology", "Latin IV"].map((course) => (
                <div key={course} className="flex items-center gap-3 p-3 rounded-lg bg-sjcs-surface-container-low">
                  <span className="material-symbols-outlined text-sjcs-secondary text-sm">school</span>
                  <span className="text-sm font-medium">{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
