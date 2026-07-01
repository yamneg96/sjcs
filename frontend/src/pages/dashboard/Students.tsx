import { useState, useEffect } from "react";
import api from "@/lib/api";

interface IStudent {
  _id: string;
  fullName: string;
  studentId: string;
  email?: string;
  grade: number;
  status: "Active" | "Pending" | "Suspended";
  createdAt: string;
}

export default function OrgStudentsPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals / toggles states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState<IStudent | null>(null);

  // Add form input states
  const [addName, setAddName] = useState("");
  const [addStudentId, setAddStudentId] = useState("");
  const [addGrade, setAddGrade] = useState<number>(9);
  const [adding, setAdding] = useState(false);

  // Reset password states
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  // CSV Import States
  const [showImportForm, setShowImportForm] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/members/students`, {
        params: { page, limit, search }
      });
      const data = response.data?.data;
      setStudents(data?.results || []);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addStudentId || !addGrade) return;

    setAdding(true);
    try {
      await api.post("/members/students", {
        fullName: addName,
        studentId: addStudentId,
        grade: addGrade,
      });

      alert("Student created successfully!");
      setAddName("");
      setAddStudentId("");
      setAddGrade(9);
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      console.error("Failed to create student:", error);
      alert("Error: Student ID already exists or invalid data.");
    } finally {
      setAdding(false);
    }
  };

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setImporting(true);
    try {
      // Basic parser: Full Name, Student ID, Grade
      // Split lines and parse commas
      const lines = csvText.split("\n");
      const list = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        const [name, id, gradeStr] = line.split(",").map(s => s.trim());
        if (name && id && gradeStr) {
          list.push({
            fullName: name,
            studentId: id,
            grade: Number(gradeStr),
          });
        }
      }

      if (list.length === 0) {
        alert("Invalid CSV format. Use: Full Name,Student ID,Grade");
        setImporting(false);
        return;
      }

      const response = await api.post("/members/students/import", { students: list });
      alert(response.data?.message || "CSV parsed and students imported!");
      setCsvText("");
      setShowImportForm(false);
      fetchStudents();
    } catch (error) {
      console.error("Failed to import CSV:", error);
      alert("Error importing students CSV.");
    } finally {
      setImporting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetForm || !newPassword) return;

    setResetting(true);
    try {
      await api.put(`/members/students/${showResetForm._id}/reset-password`, {
        password: newPassword,
      });

      alert(`Password updated successfully for ${showResetForm.fullName}!`);
      setNewPassword("");
      setShowResetForm(null);
    } catch (error) {
      console.error("Failed to reset password:", error);
      alert("Error resetting password.");
    } finally {
      setResetting(false);
    }
  };

  const handleToggleStatus = async (student: IStudent) => {
    const isSuspended = student.status === "Suspended";
    const endpoint = `/members/${student._id}/${isSuspended ? "activate" : "suspend"}`;
    if (!confirm(`Are you sure you want to ${isSuspended ? "activate" : "suspend"} ${student.fullName}?`)) return;

    try {
      const response = await api.put(endpoint);
      const updatedItem = response.data?.data;
      setStudents(students.map(s => s._id === student._id ? { ...s, status: updatedItem.status } : s));
    } catch (error) {
      console.error("Failed to modify member status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <main className="min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block animate-fade-in-down">Academic Registry</span>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-sjcs-on-surface">Student <span className="text-sjcs-primary">CRM</span></h1>
          <p className="mt-2 text-sjcs-on-surface-variant text-sm">Coordinate enrolled student profiles, review academic access levels, and override security permissions.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportForm(!showImportForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sjcs-surface-container-highest text-sjcs-on-surface text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-sjcs-surface-variant"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            Import CSV
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 leadership-gradient text-sjcs-on-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Add Manually
          </button>
        </div>
      </header>

      {/* Slide-in CSV Import form */}
      {showImportForm && (
        <section className="bg-sjcs-surface-container-lowest p-6 rounded-2xl border border-sjcs-outline-variant/15 shadow-ambient mb-8 animate-fade-in">
          <h3 className="font-headline font-bold text-lg mb-2">Bulk Import Students</h3>
          <p className="text-xs text-sjcs-on-surface-variant mb-4">Paste comma-separated rows. Format: <code className="bg-sjcs-surface-container px-1.5 py-0.5 rounded font-bold font-mono">Full Name,Student ID,Grade</code> (e.g. John Doe,SJCS-1029,11)</p>
          <form onSubmit={handleImportCSV} className="space-y-4">
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-4 rounded-xl bg-sjcs-surface-container border-none text-xs font-semibold font-mono outline-none resize-none"
              placeholder="Julian Mercer,SJCS-1033,10&#10;Amelia Vance,SJCS-1034,12"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={importing}
                className="leadership-gradient text-sjcs-on-primary px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md disabled:opacity-50"
              >
                {importing ? "Importing Records..." : "Process Registry CSV"}
              </button>
              <button
                type="button"
                onClick={() => setShowImportForm(false)}
                className="bg-sjcs-surface-container text-sjcs-on-surface px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Slide-in Manual Add Form */}
      {showAddForm && (
        <section className="bg-sjcs-surface-container-lowest p-6 rounded-2xl border border-sjcs-outline-variant/15 shadow-ambient mb-8 animate-fade-in">
          <h3 className="font-headline font-bold text-lg mb-4">Onboard Student Manually</h3>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Full Name</label>
              <input
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g. Julian Mercer"
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Student ID (Unique)</label>
              <input
                type="text"
                required
                value={addStudentId}
                onChange={(e) => setAddStudentId(e.target.value)}
                placeholder="e.g. SJCS-2041"
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Academic Grade</label>
              <select
                value={addGrade}
                onChange={(e) => setAddGrade(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
              >
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={adding}
                className="flex-1 leadership-gradient text-sjcs-on-primary py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md active:scale-95 disabled:opacity-50"
              >
                {adding ? "Onboarding..." : "Enroll Scholar"}
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

      {/* Reset Password Modal */}
      {showResetForm && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <section className="bg-sjcs-surface-container-lowest p-8 rounded-2xl border border-sjcs-outline-variant/15 shadow-2xl max-w-sm w-full mx-4 space-y-6">
            <header className="border-b border-sjcs-outline-variant/10 pb-4">
              <h3 className="font-headline font-bold text-lg">Reset Password</h3>
              <p className="text-xs text-sjcs-on-surface-variant mt-1">Override login credentials for <span className="font-bold text-sjcs-primary">{showResetForm.fullName}</span></p>
            </header>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetForm(null)}
                  className="px-4 py-2.5 bg-sjcs-surface-container text-sjcs-on-surface rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="leadership-gradient text-sjcs-on-primary px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md disabled:opacity-50"
                >
                  {resetting ? "Resetting..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Main CRM Table Container */}
      <div className="bg-sjcs-surface-container-lowest rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient overflow-hidden">
        {/* Table Search & Total summary */}
        <div className="p-6 border-b border-sjcs-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sjcs-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-sjcs-surface-container rounded-xl text-xs border-none focus:ring-2 focus:ring-sjcs-primary/20 outline-none"
              placeholder="Quick search registry..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="text-xs font-bold text-sjcs-on-surface-variant uppercase tracking-wider">
            Total Enrolled: <span className="text-sjcs-primary">{total}</span> Active Scholars
          </div>
        </div>

        {/* The data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sjcs-surface-container-low/40 border-b border-sjcs-outline-variant/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Full Name</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Student ID</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Academic Grade</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant">Access Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-sjcs-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sjcs-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-sjcs-on-surface-variant/75 font-semibold">
                    Fetching academic records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-sjcs-on-surface-variant/75 font-semibold">
                    No active student records matched searching or filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-sjcs-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sjcs-primary/10 text-sjcs-primary flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {student.fullName.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-sjcs-on-surface leading-tight">{student.fullName}</p>
                          <p className="text-[10px] text-sjcs-on-surface-variant mt-0.5">{student.email || "No email assigned"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-extrabold bg-sjcs-surface-container px-2 py-0.5 rounded text-sjcs-on-surface-variant border border-sjcs-outline-variant/10">
                        {student.studentId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-sjcs-on-surface">Grade {student.grade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        student.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                        student.status === "Pending" ? "bg-amber-100 text-amber-800" :
                        "bg-rose-100 text-rose-800"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(student)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-xs transition-all ${
                            student.status === "Suspended" ? "text-emerald-600 hover:text-emerald-700" : "text-rose-500 hover:text-rose-600"
                          }`}
                          title={student.status === "Suspended" ? "Activate Account" : "Suspend Account"}
                        >
                          <span className="material-symbols-outlined text-sm">{student.status === "Suspended" ? "play_circle" : "block"}</span>
                        </button>
                        <button
                          onClick={() => setShowResetForm(student)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-xs text-sjcs-primary hover:text-sjcs-primary-dark transition-all"
                          title="Reset Password"
                        >
                          <span className="material-symbols-outlined text-sm">lock_reset</span>
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
