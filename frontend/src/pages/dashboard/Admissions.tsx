import React, { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { useAdmissions, useUpdateAdmissionStatus, useAddDocument } from "@/hooks/use-admissions";
import { useUploadFile } from "@/hooks/use-materials";
import type { AdmissionStatus, IAdmission, IAdmissionDocument } from "@/types/api.types";

export default function OrgAdmissionsPage() {
  const [filterStatus, setFilterStatus] = useState<AdmissionStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string | null>(null);

  // Form edit states
  const [newStatus, setNewStatus] = useState<AdmissionStatus>("PENDING_REVIEW");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [reviewerNotes, setReviewerNotes] = useState("");

  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Fetch admissions using TanStack Query hook
  const { data: admissionsData, isLoading } = useAdmissions({
    status: filterStatus === "ALL" ? undefined : filterStatus,
  });

  const { mutateAsync: updateStatus, isPending: updating } = useUpdateAdmissionStatus();
  const { mutateAsync: uploadFile } = useUploadFile();
  const { mutateAsync: addDocument } = useAddDocument();

  const admissions = admissionsData?.results || [];

  const handleSelectAdmission = (a: IAdmission) => {
    setSelectedAdmissionId(a._id);
    setNewStatus(a.status);
    setInterviewDate(a.interviewDate || "");
    setInterviewTime(a.interviewTime || "");
    setInterviewNotes(a.interviewNotes || "");
    setReviewerNotes(a.reviewerNotes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmissionId) return;

    try {
      await updateStatus({
        admissionId: selectedAdmissionId,
        data: {
          status: newStatus,
          interviewDate: newStatus === "INTERVIEW_SCHEDULED" ? interviewDate : undefined,
          interviewTime: newStatus === "INTERVIEW_SCHEDULED" ? interviewTime : undefined,
          interviewNotes,
          reviewerNotes,
        },
      });
      alert("Application status updated and notifications sent successfully!");
    } catch (err) {
      alert("Failed to update: " + getErrorMessage(err));
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAdmissionId) return;

    setUploadingDoc(true);
    try {
      // 1. Upload to storage API (public/private handles)
      const res = await uploadFile(file);
      const { fileUrl } = res.data.data;

      // 2. Link file metadata to admission application
      await addDocument({
        admissionId: selectedAdmissionId,
        data: {
          fileName: file.name,
          fileUrl,
          fileType: file.name.split(".").pop() || "pdf",
          mimeType: file.type,
        },
      });

      alert("Dossier attachment registered successfully!");
    } catch (err) {
      alert("Document registration failed: " + getErrorMessage(err));
    } finally {
      setUploadingDoc(false);
    }
  };

  const filteredAdmissions = admissions.filter((a) => {
    const query = searchTerm.toLowerCase();
    const studentFull = `${a.studentFirstName} ${a.studentLastName}`.toLowerCase();
    return (
      studentFull.includes(query) ||
      a.parentName.toLowerCase().includes(query) ||
      a.parentEmail.toLowerCase().includes(query)
    );
  });

  const selectedAdmission = admissions.find((a) => a._id === selectedAdmissionId);

  const statusLabel = (status: AdmissionStatus) => {
    switch (status) {
      case "INQUIRY": return "Inquiry";
      case "PENDING_REVIEW": return "Pending Review";
      case "INTERVIEW_SCHEDULED": return "Interview Scheduled";
      case "APPROVED": return "Approved";
      case "REJECTED": return "Rejected";
      case "WAITLISTED": return "Waitlisted";
      default: return status;
    }
  };

  return (
    <main className="min-h-screen animate-fade-in">
      <header className="mb-10">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
          Enrollment Hub
        </span>
        <h1 className="font-headline text-4xl font-black tracking-tight text-foreground">
          Admissions <span className="text-primary">Desk</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-2xl">
          Review parent inquiries, audit student transcripts, schedule interviews, and trigger automatic email briefings.
        </p>
      </header>

      {/* Grid containing Search, List and Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filters + List */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border/10 shadow-ambient flex flex-col gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-sjcs-surface-container rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="Search by student name or parent email..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {(["ALL", "INQUIRY", "PENDING_REVIEW", "INTERVIEW_SCHEDULED", "APPROVED", "REJECTED", "WAITLISTED"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg font-label text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterStatus === status
                      ? "leadership-gradient text-white shadow-sm"
                      : "bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-muted-foreground"
                  }`}
                >
                  {status === "ALL" ? "All Application States" : statusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* List Wrapper */}
          <div className="bg-card rounded-2xl border border-border/10 shadow-ambient overflow-hidden">
            {isLoading ? (
              <div className="flex py-20 items-center justify-center text-muted-foreground font-semibold">
                <div className="animate-pulse">Loading admissions roll...</div>
              </div>
            ) : filteredAdmissions.length === 0 ? (
              <div className="flex py-20 flex-col items-center justify-center text-muted-foreground text-sm uppercase tracking-wide gap-3">
                <span className="material-symbols-outlined text-4xl text-primary/30">inbox</span>
                No admission dossiers found
              </div>
            ) : (
              <div className="divide-y divide-border/10">
                {filteredAdmissions.map((a) => {
                  const isSelected = selectedAdmissionId === a._id;
                  const fullName = `${a.studentFirstName} ${a.studentLastName}`;
                  return (
                    <div
                      key={a._id}
                      onClick={() => handleSelectAdmission(a)}
                      className={`p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-muted/20 ${
                        isSelected ? "bg-primary/5 border-l-4 border-primary" : ""
                      }`}
                    >
                      <div>
                        <h4 className="font-headline font-bold text-sm tracking-tight">{fullName}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Parent: {a.parentName} ({a.parentEmail}) • Grade {a.gradeAppliedFor}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-2">
                          Filed {new Date(a.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          a.status === "INQUIRY" ? "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200" :
                          a.status === "PENDING_REVIEW" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" :
                          a.status === "INTERVIEW_SCHEDULED" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400" :
                          a.status === "APPROVED" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400" :
                          a.status === "REJECTED" ? "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400" :
                          "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        }`}>
                          {statusLabel(a.status)}
                        </span>
                        <span className="material-symbols-outlined text-muted-foreground/40 text-sm">
                          chevron_right
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Applicant Details & Workflow Form */}
        <section className="lg:col-span-5">
          {selectedAdmission ? (
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border/10 shadow-ambient flex flex-col gap-6 sticky top-24">
              <header className="border-b border-border/10 pb-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Candidate Dossier</span>
                    <h3 className="font-headline text-2xl font-black mt-1 tracking-tight">
                      {selectedAdmission.studentFirstName} {selectedAdmission.studentLastName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{selectedAdmission.parentEmail}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    selectedAdmission.status === "INQUIRY" ? "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200" :
                    selectedAdmission.status === "PENDING_REVIEW" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400" :
                    selectedAdmission.status === "INTERVIEW_SCHEDULED" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400" :
                    selectedAdmission.status === "APPROVED" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400" :
                    "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400"
                  }`}>
                    {statusLabel(selectedAdmission.status)}
                  </span>
                </div>
              </header>

              {/* Dossier contents */}
              <div className="space-y-4 text-xs text-foreground">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Applying Grade</h5>
                    <p className="font-semibold">Grade {selectedAdmission.gradeAppliedFor}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Student Gender</h5>
                    <p className="font-semibold capitalize">{selectedAdmission.studentGender}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Date of Birth</h5>
                    <p className="font-semibold">{new Date(selectedAdmission.studentDOB).toLocaleDateString()}</p>
                  </div>
                  {selectedAdmission.previousSchool && (
                    <div>
                      <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Previous School</h5>
                      <p className="font-semibold truncate">{selectedAdmission.previousSchool}</p>
                    </div>
                  )}
                </div>

                {selectedAdmission.transferReason && (
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Reason for Transfer</h5>
                    <p className="bg-muted p-2 rounded-xl text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      "{selectedAdmission.transferReason}"
                    </p>
                  </div>
                )}

                {selectedAdmission.status === "INTERVIEW_SCHEDULED" && selectedAdmission.interviewDate && (
                  <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-xl">
                    <h5 className="text-[9px] font-bold uppercase tracking-wide text-purple-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      Interview Registered
                    </h5>
                    <p className="text-sm font-semibold mt-1">
                      {new Date(selectedAdmission.interviewDate).toLocaleDateString()} at {selectedAdmission.interviewTime || "--:--"}
                    </p>
                  </div>
                )}

                {/* File Attachments */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Supporting Documents</h5>
                    <label className="text-[9px] font-black uppercase text-primary tracking-wide cursor-pointer hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">{uploadingDoc ? "hourglass_top" : "add"}</span>
                      {uploadingDoc ? "Attaching..." : "Attach File"}
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        onChange={handleDocumentUpload} 
                        disabled={uploadingDoc}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {selectedAdmission.documents && selectedAdmission.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAdmission.documents.map((doc: IAdmissionDocument, idx: number) => (
                        <a
                          key={idx}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-sjcs-surface-container hover:bg-primary/5 transition-all text-xs font-semibold group border border-border/10"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="material-symbols-outlined text-primary text-base">description</span>
                            <span className="truncate">{doc.fileName}</span>
                          </span>
                          <span className="material-symbols-outlined text-secondary text-sm group-hover:translate-x-1 duration-200">
                            arrow_outward
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-muted-foreground/70">No transcripts or birth certificates uploaded.</p>
                  )}
                </div>
              </div>

              {/* Action State Machine Form */}
              <form onSubmit={handleUpdateStatus} className="border-t border-border/10 pt-6 space-y-4">
                <h4 className="font-headline font-bold text-sm">Update Candidate Status</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Status Stage</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-sjcs-surface-container border-none text-xs font-semibold outline-none"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as AdmissionStatus)}
                    >
                      <option value="INQUIRY">Inquiry</option>
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="INTERVIEW_SCHEDULED">Schedule Interview</option>
                      <option value="APPROVED">Approve Application</option>
                      <option value="REJECTED">Reject Application</option>
                      <option value="WAITLISTED">Waitlist Application</option>
                    </select>
                  </div>

                  {newStatus === "INTERVIEW_SCHEDULED" && (
                    <div className="space-y-2 animate-fade-in col-span-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Date &amp; Time</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          required
                          className="w-1/2 p-2 rounded-lg bg-sjcs-surface-container border-none text-[11px] font-semibold outline-none"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                        />
                        <input
                          type="time"
                          required
                          className="w-1/2 p-2 rounded-lg bg-sjcs-surface-container border-none text-[11px] font-semibold outline-none"
                          value={interviewTime}
                          onChange={(e) => setInterviewTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {newStatus === "INTERVIEW_SCHEDULED" && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Interview Location / Access Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-sjcs-surface-container border-none text-xs font-semibold outline-none"
                      placeholder="e.g. Conference Room A / Zoom Link"
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex justify-between">
                    <span>Internal Comments / Decision Rationale</span>
                    <span className="text-[8px] font-normal text-muted-foreground italic">(sent to parent email on progress)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-sjcs-surface-container border-none text-xs font-semibold outline-none resize-none"
                    placeholder="Provide context or instructions..."
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full leadership-gradient text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? "Committing Status..." : "Save Dossier Decision"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-card p-10 rounded-2xl border border-border/10 shadow-ambient text-center text-muted-foreground font-semibold">
              Select an applicant dossier from the roll to execute status updates and attachments.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
