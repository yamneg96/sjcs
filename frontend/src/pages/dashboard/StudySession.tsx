import { useState, useEffect } from "react";

export default function StudySessionPage() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState("Philosophy");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600).toString().padStart(2, "0");
    const mins = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Focus Mode</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">Study <span className="text-sjcs-primary">Session</span></h1>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-sjcs-surface-container-lowest rounded-xl p-12 shadow-ambient text-center">
          <div className="mb-8">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-4 py-2 rounded-lg bg-sjcs-surface-container-low border-none font-headline font-bold text-center outline-none focus:ring-2 focus:ring-sjcs-secondary">
              {["Philosophy", "Mathematics", "History", "Theology", "Science", "Latin", "Literature"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="mb-12">
            <p className="text-8xl font-headline font-black tracking-tight text-sjcs-on-surface">{formatTime(seconds)}</p>
            <p className="text-label-md text-sjcs-on-surface-variant/60 mt-4">Focused Study Time</p>
          </div>

          <div className="flex gap-4 justify-center">
            {!isActive ? (
              <button onClick={() => setIsActive(true)} className="leadership-gradient text-white px-12 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase shadow-xl">
                {seconds > 0 ? "Resume" : "Start Session"}
              </button>
            ) : (
              <button onClick={() => setIsActive(false)} className="bg-sjcs-surface-container-highest text-sjcs-on-surface px-12 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase">
                Pause
              </button>
            )}
            {seconds > 0 && (
              <button onClick={() => { setIsActive(false); setSeconds(0); }} className="bg-sjcs-error-container text-sjcs-on-error-container px-8 py-4 rounded-xl font-label text-sm font-bold tracking-widest uppercase">
                End
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: "Today's Total", value: "2h 15m", icon: "schedule" },
            { label: "This Week", value: "12h 30m", icon: "date_range" },
            { label: "Streak", value: "5 Days", icon: "local_fire_department" },
          ].map((stat) => (
            <div key={stat.label} className="bg-sjcs-surface-container-lowest rounded-xl p-6 text-center shadow-ambient">
              <span className="material-symbols-outlined text-sjcs-secondary mb-2">{stat.icon}</span>
              <p className="font-headline text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-sjcs-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
