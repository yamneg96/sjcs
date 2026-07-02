import React, { useState } from "react";
import {
  useStudents,
  useCreateStudent,
  useImportStudents,
  useSuspendMember,
  useActivateMember,
  useResetStudentPassword,
} from "@/hooks/use-members";
import type { IMember } from "@/types/api.types";

export default function OrgStudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  // Modals / forms toggles
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState<IMember | null>(null);

  // Manual Add Form states
  const [addName, setAddName] = useState("");
  const [addStudentId, setAddStudentId] = useState("");
  const [addGrade, setAddGrade] = useState<number>(9);

  // Reset Password states
  const [newPassword, setNewPassword] = useState("");

  // CSV Import state
  const [csvText, setCsvText] = useState("");

  // Queries & Mutations
  const { data, isLoading } = useStudents(page, limit, search);
  const students = data?.results || [];
  const total = data?.total || 0;

  const { mutateAsync: createStudent, isPending: adding } = useCreateStudent();
  const { mutateAsync: importStudents, isPending: importing } = useImportStudents();
  const { mutateAsync: suspendMember } = useSuspendMember();
  const { mutateAsync: activateMember } = useActivateMember();
  const { mutateAsync: resetPassword, isPending: resetting } = useResetStudentPassword();

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addStudentId || !addGrade) return;

    try {
      await createStudent({
        fullName: addName,
        studentId: addStudentId,
        grade: addGrade,
      });
      alert("Student enrolled successfully!");
      setAddName("");
      setAddStudentId("");
      setAddGrade(9);
      setShowAddForm(false);
    } catch (err: any) {
      alert("Registration failed: " + (err.extractedMessage || err.message));
    }
  };

  const handleImportCSV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    try {
      const lines = csvText.split("\n");
      const list = [];
      for (const line of lines) {
        if (!line.trim()) continue;
        const [name, id, gradeStr] = line.split(",").map((s) => s.trim());
        if (name && id && gradeStr) {
          list.push({
            fullName: name,
            studentId: id,
            grade: Number(gradeStr),
          });
        }
      }

      if (list.length === 0) {
        alert("Invalid CSV format. Expected: Full Name,Student ID,Grade");
        return;
      }

      const res = await importStudents({ students: list });
      alert(res.data.message || `Imported ${res.data.data?.importedCount || list.length} students!`);
      setCsvText("");
      setShowImportForm(false);
    } catch (err: any) {
      alert("Import failed: " + (err.extractedMessage || err.message));
    }
  };

  const handleToggleStatus = async (student: IMember) => {
    const isSuspended = student.status === "Suspended";
    const opText = isSuspended ? "activate" : "suspend";
    if (!confirm(`Are you sure you want to ${opText} ${student.fullName}?`)) return;

    try {
      if (isSuspended) {
        await activateMember(student._id);
      } else {
        await suspendMember(student._id);
      }
      alert(`Account status updated successfully.`);
    } catch (err: any) {
      alert("Failed to change status: " + (err.extractedMessage || err.message));
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showResetForm || !newPassword) return;

    try {
      await resetPassword({
        studentId: showResetForm._id,
        password: newPassword,
      });
      alert(`Access credentials reset for ${showResetForm.fullName}`);
      setNewPassword("");
      setShowResetForm(null);
    } catch (err: any) {
      alert("Password override failed: " + (err.extractedMessage || err.message));
    }
  };

  return (
    <main className="min-h-screen animate-fade-in text-foreground">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
            Academic Registry
          </span>
          <h1 className="font-headline text-4xl font-black tracking-tight text-foreground">
            Student <span className="text-primary">CRM</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-xl">
            Coordinate enrolled student portfolios, review academic access levels, and override security permissions.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportForm(!showImportForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sjcs-surface-container-highest text-foreground text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-sjcs-surface-variant border border-border/10"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            Import CSV
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 leadership-gradient text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Add Manually
          </button>
        </div>
      </header>

      {/* CSV Import Drawers */}
      {showImportForm && (
        <section className="bg-card p-6 rounded-2xl border border-border/15 shadow-ambient mb-8 animate-fade-in">
          <h3 className="font-headline font-bold text-lg mb-2">Bulk Import Students</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Paste comma-separated rows. Format:{" "}
            <code className="bg-sjcs-surface-container px-1.5 py-0.5 rounded font-bold font-mono">
              Full Name,Student ID,Grade
            </code>{" "}
            (e.g. John Doe,SJCS-1029,11)
          </p>
          <form onSubmit={handleImportCSV} className="space-y-4">
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-4 rounded-xl bg-sjcs-surface-container border-none text-xs font-semibold font-mono outline-none resize-none"
              placeholder={`Julian Mercer,SJCS-1033,10\nAmelia Vance,SJCS-1034,12`}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={importing}
                className="leadership-gradient text-white px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md disabled:opacity-50"
              >
                {importing ? "Importing Records..." : "Process Registry CSV"}
              </button>
              <button
                type="button"
                onClick={() => setShowImportForm(false)}
                className="bg-sjcs-surface-container text-foreground px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Manual Add Form Drawer */}
      {showAddForm && (
        <section className="bg-card p-6 rounded-2xl border border-border/15 shadow-ambient mb-8 animate-fade-in">
          <h3 className="font-headline font-bold text-lg mb-4">Onboard Student Manually</h3>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
              <input
                type="text"
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g. Julian Mercer"
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Student ID (Unique)</label>
              <input
                type="text"
                required
                value={addStudentId}
                onChange={(e) => setAddStudentId(e.target.value)}
                placeholder="e.g. SJCS-2041"
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Academic Grade</label>
              <select
                value={addGrade}
                onChange={(e) => setAddGrade(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
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
                className="flex-1 leadership-gradient text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md active:scale-95 disabled:opacity-50"
              >
                {adding ? "Onboarding..." : "Enroll Scholar"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 bg-sjcs-surface-container text-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Password Reset Dialog */}
      {showResetForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <section className="bg-card p-8 rounded-2xl border border-border/15 shadow-2xl max-w-sm w-full mx-4 space-y-6">
            <header className="border-b border-border/10 pb-4">
              <h3 className="font-headline font-bold text-lg text-foreground">Reset Password</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Override credentials for <span className="font-bold text-primary">{showResetForm.fullName}</span>
              </p>
            </header>
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetForm(null)}
                  className="px-4 py-2.5 bg-sjcs-surface-container text-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetting}
                  className="leadership-gradient text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md disabled:opacity-50"
                >
                  {resetting ? "Resetting..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Main CRM Table Roll */}
      <div className="bg-card rounded-2xl border border-border/10 shadow-ambient overflow-hidden">
        <div className="p-6 border-b border-border/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-sjcs-surface-container rounded-xl text-xs border-none focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Search by scholar name or ID..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Total Enrolled: <span className="text-primary">{total}</span> Active Scholars
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sjcs-surface-container-low/40 border-b border-border/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Full Name</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Student ID</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Grade Level</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Access Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground font-semibold">
                    <div className="animate-pulse">Fetching academic registries...</div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground font-semibold">
                    No active student records matched search terms.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl leadership-gradient text-white flex items-center justify-center font-extrabold text-xs uppercase shadow-sm">
                          {student.fullName.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground leading-tight">{student.fullName}</p>
                          <p className="text-[9px] text-muted-foreground tracking-wide mt-0.5">
                            Created {new Date(student.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-extrabold bg-sjcs-surface-container px-2 py-0.5 rounded text-muted-foreground border border-border/5">
                        {student.studentId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-foreground">Grade {student.grade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        student.status === "Active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400" :
                        student.status === "Pending" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" :
                        "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(student)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sjcs-surface-container text-xs transition-all ${
                            student.status === "Suspended" ? "text-emerald-500 hover:text-emerald-600" : "text-rose-500 hover:text-rose-600"
                          }`}
                          title={student.status === "Suspended" ? "Activate Scholar" : "Suspend Scholar"}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {student.status === "Suspended" ? "play_circle" : "block"}
                          </span>
                        </button>
                        <button
                          onClick={() => setShowResetForm(student)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sjcs-surface-container text-xs text-primary transition-all"
                          title="Reset Password Override"
                        >
                          <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination footer */}
        {total > limit && (
          <footer className="p-6 border-t border-border/10 flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-sjcs-surface-container hover:bg-sjcs-surface-container-high rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => (p * limit < total ? p + 1 : p))}
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
