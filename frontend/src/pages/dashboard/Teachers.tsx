import { useState, useEffect } from "react";
import api from "@/lib/api";

interface ITeacher {
  _id: string;
  fullName: string;
  email: string;
  grades: number[];
  status: "Active" | "Pending" | "Suspended";
  createdAt: string;
}

export default function OrgTeachersPage() {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Onboard new faculty input states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addGrades, setAddGrades] = useState<number[]>([9]);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, [page, search]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/members/teachers`, {
        params: { page, limit, search }
      });
      const data = response.data?.data;
      setTeachers(data?.results || []);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail || addGrades.length === 0) return;

    setOnboarding(true);
    try {
      await api.post("/members/teachers", {
        fullName: addName,
        email: addEmail,
        grades: addGrades,
      });

      alert("Teacher onboarded successfully! Verification email dispatched.");
      setAddName("");
      setAddEmail("");
      setAddGrades([9]);
      setShowAddForm(false);
      fetchTeachers();
    } catch (error) {
      console.error("Failed to onboard teacher:", error);
      alert("Error: Email is already registered or values are invalid.");
    } finally {
      setOnboarding(false);
    }
  };

  const handleToggleGradeSelection = (grade: number) => {
    if (addGrades.includes(grade)) {
      setAddGrades(addGrades.filter(g => g !== grade));
    } else {
      setAddGrades([...addGrades, grade]);
    }
  };

  const handleToggleStatus = async (teacher: ITeacher) => {
    const isSuspended = teacher.status === "Suspended";
    const endpoint = `/members/${teacher._id}/${isSuspended ? "activate" : "suspend"}`;
    if (!confirm(`Are you sure you want to ${isSuspended ? "activate" : "suspend"} Prof. ${teacher.fullName}?`)) return;

    try {
      const response = await api.put(endpoint);
      const updatedItem = response.data?.data;
      setTeachers(teachers.map(t => t._id === teacher._id ? { ...t, status: updatedItem.status } : t));
    } catch (error) {
      console.error("Failed to modify teacher status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <main className="min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block animate-fade-in-down">Faculty Governance</span>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-sjcs-on-surface">Staff &amp; <span className="text-sjcs-primary">Teachers</span></h1>
          <p className="mt-2 text-sjcs-on-surface-variant text-sm">Coordinate department faculty allocations, assign academic grade-level authorizations, and audit system status parameters.</p>
        </div>
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 leadership-gradient text-sjcs-on-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Onboard Faculty
          </button>
        </div>
      </header>

      {/* Onboarding slider form panel */}
      {showAddForm && (
        <section className="bg-sjcs-surface-container-lowest p-8 rounded-2xl border border-sjcs-outline-variant/15 shadow-ambient mb-8 animate-fade-in">
          <h3 className="font-headline font-bold text-lg mb-4">Onboard New Faculty Member</h3>
          <form onSubmit={handleOnboardTeacher} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Dr. Julian Mercer"
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Assigned Email</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="e.g. mercer.j@sjcs.edu"
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                />
              </div>
            </div>

            {/* Selecting multiple grades */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label block">Grade Authorization Levels</label>
              <div className="flex gap-3">
                {[9, 10, 11, 12].map((grade) => {
                  const isChecked = addGrades.includes(grade);
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleToggleGradeSelection(grade)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        isChecked 
                          ? "bg-sjcs-secondary text-white shadow-sm" 
                          : "bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-sjcs-on-surface-variant"
                      }`}
                    >
                      Grade {grade}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={onboarding}
                className="leadership-gradient text-sjcs-on-primary px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg disabled:opacity-50"
              >
                {onboarding ? "Dispatched Credentials..." : "Complete Faculty Onboarding"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 bg-sjcs-surface-container text-sjcs-on-surface rounded-xl text-[10px] font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main Faculty Table Container */}
      <div className="bg-sjcs-surface-container-lowest rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient overflow-hidden">
        {/* Table Search & Total summary */}
        <div className="p-6 border-b border-sjcs-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sjcs-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-sjcs-surface-container rounded-xl text-xs border-none focus:ring-2 focus:ring-sjcs-primary/20 outline-none"
              placeholder="Search faculty name..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="text-xs font-bold text-sjcs-on-surface-variant uppercase tracking-wider">
            Total Staff Directory: <span className="text-sjcs-primary">{total}</span> Active Faculty
          </div>
        </div>

        {/* The data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sjcs-surface-container-low/40 border-b border-sjcs-outline-variant/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Faculty Member</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Grade Authorizations</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Platform Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Account Creation</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sjcs-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-sjcs-on-surface-variant/75 font-semibold">
                    Loading department faculty list...
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-sjcs-on-surface-variant/75 font-semibold">
                    No faculty staff registered in directory.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-sjcs-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sjcs-primary/10 text-sjcs-primary flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {teacher.fullName.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-sjcs-on-surface leading-tight">Prof. {teacher.fullName}</p>
                          <p className="text-[10px] text-sjcs-on-surface-variant mt-0.5">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.grades?.map((g) => (
                          <span key={g} className="px-2 py-0.5 bg-sjcs-surface-container text-sjcs-on-surface-variant text-[9px] font-bold rounded border border-sjcs-outline-variant/5">
                            Grade {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        teacher.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                        teacher.status === "Pending" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-sjcs-on-surface-variant">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(teacher)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-xs transition-all ${
                            teacher.status === "Suspended" ? "text-emerald-600 hover:text-emerald-700" : "text-rose-500 hover:text-rose-600"
                          }`}
                          title={teacher.status === "Suspended" ? "Activate Account" : "Suspend Access"}
                        >
                          <span className="material-symbols-outlined text-sm">{teacher.status === "Suspended" ? "play_circle" : "block"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {total > limit && (
          <footer className="p-6 border-t border-sjcs-outline-variant/10 flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-sjcs-surface-container hover:bg-sjcs-surface-container-high rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[10px] font-bold text-sjcs-on-surface-variant uppercase tracking-wider">Page {page} of {Math.ceil(total / limit)}</span>
            <button
              onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
              disabled={page * limit >= total}
              className="px-4 py-2 bg-sjcs-surface-container hover:bg-sjcs-surface-container-high rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-40"
            >
              Next
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
