import React, { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { useTeachers, useCreateTeacher, useSuspendMember, useActivateMember } from "@/hooks/use-members";
import type { IMember } from "@/types/api.types";

export default function OrgTeachersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  // Onboard new faculty input states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addGrades, setAddGrades] = useState<number[]>([9]);

  // Queries & Mutations
  const { data, isLoading } = useTeachers(page, limit, search);
  const teachers = data?.results || [];
  const total = data?.total || 0;

  const { mutateAsync: createTeacher, isPending: onboarding } = useCreateTeacher();
  const { mutateAsync: suspendMember } = useSuspendMember();
  const { mutateAsync: activateMember } = useActivateMember();

  const handleOnboardTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail || addGrades.length === 0) return;

    try {
      await createTeacher({
        fullName: addName,
        email: addEmail,
        grades: addGrades,
      });

      alert("Teacher onboarded successfully! Activation link dispatched to email.");
      setAddName("");
      setAddEmail("");
      setAddGrades([9]);
      setShowAddForm(false);
    } catch (err) {
      alert("Faculty onboarding failed: " + getErrorMessage(err));
    }
  };

  const handleToggleGradeSelection = (grade: number) => {
    if (addGrades.includes(grade)) {
      setAddGrades(addGrades.filter((g) => g !== grade));
    } else {
      setAddGrades([...addGrades, grade]);
    }
  };

  const handleToggleStatus = async (teacher: IMember) => {
    const isSuspended = teacher.status === "Suspended";
    const opText = isSuspended ? "activate" : "suspend";
    if (!confirm(`Are you sure you want to ${opText} Prof. ${teacher.fullName}?`)) return;

    try {
      if (isSuspended) {
        await activateMember(teacher._id);
      } else {
        await suspendMember(teacher._id);
      }
      alert("Faculty status updated successfully.");
    } catch (err) {
      alert("Failed to modify: " + getErrorMessage(err));
    }
  };

  return (
    <main className="min-h-screen animate-fade-in text-foreground">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
            Faculty Governance
          </span>
          <h1 className="font-headline text-4xl font-black tracking-tight text-foreground">
            Staff &amp; <span className="text-primary">Teachers</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-xl">
            Coordinate department faculty allocations, assign academic grade-level authorizations, and audit system status parameters.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-2.5 leadership-gradient text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Onboard Faculty
          </button>
        </div>
      </header>

      {/* Onboarding slider form panel */}
      {showAddForm && (
        <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/15 shadow-ambient mb-8 animate-fade-in">
          <h3 className="font-headline font-bold text-lg mb-4 text-foreground">Onboard New Faculty Member</h3>
          <form onSubmit={handleOnboardTeacher} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Dr. Julian Mercer"
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Assigned Email</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="e.g. mercer.j@sjcs.edu"
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Selecting multiple grades */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">
                Grade Authorization Levels
              </label>
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
                          ? "bg-secondary text-white shadow-sm"
                          : "bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-muted-foreground"
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
                className="leadership-gradient text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg disabled:opacity-50"
              >
                {onboarding ? "Dispatched Credentials..." : "Complete Faculty Onboarding"}
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

      {/* Main Faculty Table Container */}
      <div className="bg-card rounded-2xl border border-border/10 shadow-ambient overflow-hidden">
        {/* Table Search & Total summary */}
        <div className="p-6 border-b border-border/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-sjcs-surface-container rounded-xl text-xs border-none focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Search faculty directories..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Total Staff Directory: <span className="text-primary">{total}</span> Active Faculty
          </div>
        </div>

        {/* The data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sjcs-surface-container-low/40 border-b border-border/10">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Faculty Member</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Grade Authorizations</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Platform Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Account Creation</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground font-semibold">
                    <div className="animate-pulse">Loading department faculty list...</div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-xs text-muted-foreground font-semibold">
                    No faculty staff registered in directory.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl leadership-gradient text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {teacher.fullName.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground leading-tight">Prof. {teacher.fullName}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.grades?.map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 bg-sjcs-surface-container text-muted-foreground text-[9px] font-bold rounded border border-border/5"
                          >
                            Grade {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        teacher.status === "Active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400" :
                        teacher.status === "Pending" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" :
                        "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(teacher)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sjcs-surface-container transition-all ${
                            teacher.status === "Suspended" ? "text-emerald-500 hover:text-emerald-600" : "text-rose-500 hover:text-rose-500"
                          }`}
                          title={teacher.status === "Suspended" ? "Activate Account" : "Suspend Access"}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {teacher.status === "Suspended" ? "play_circle" : "block"}
                          </span>
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
