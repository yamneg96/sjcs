import { useState, useEffect } from "react";
import api from "@/lib/api";

interface IDocument {
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

interface IAdmission {
  _id: string;
  studentName: string;
  email: string;
  grade: number;
  status: "Inquiry" | "Pending" | "Review" | "Interview" | "Approved" | "Rejected";
  comments?: string;
  scheduledDateTime?: string;
  documents: IDocument[];
  createdAt: string;
  updatedAt: string;
}

export default function OrgAdmissionsPage() {
  const [admissions, setAdmissions] = useState<IAdmission[]>([]);
  const [selectedAdmission, setSelectedAdmission] = useState<IAdmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Edit action state
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [comments, setComments] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState("");

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admissions");
      // The response is { success: true, data: { docs, total, page, pages } } or similar
      const listData = response.data?.data?.docs || response.data?.data || [];
      setAdmissions(listData);
      if (listData.length > 0 && !selectedAdmission) {
        setSelectedAdmission(listData[0]);
        setNewStatus(listData[0].status);
        setComments(listData[0].comments || "");
        setScheduledDateTime(listData[0].scheduledDateTime ? new Date(listData[0].scheduledDateTime).toISOString().substring(0, 16) : "");
      }
    } catch (error) {
      console.error("Failed to fetch admissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdmission = (admission: IAdmission) => {
    setSelectedAdmission(admission);
    setNewStatus(admission.status);
    setComments(admission.comments || "");
    setScheduledDateTime(admission.scheduledDateTime ? new Date(admission.scheduledDateTime).toISOString().substring(0, 16) : "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    setUpdating(true);
    try {
      const payload: Record<string, any> = {
        status: newStatus,
        comments,
      };
      if (newStatus === "Interview" && scheduledDateTime) {
        payload.scheduledDateTime = new Date(scheduledDateTime).toISOString();
      }

      const response = await api.patch(`/admissions/${selectedAdmission._id}/status`, payload);
      const updated = response.data?.data;
      
      // Update local state list
      setAdmissions(admissions.map(a => a._id === updated._id ? updated : a));
      setSelectedAdmission(updated);
      alert("Admission record updated successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error: Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredAdmissions = admissions.filter(a => {
    const matchesFilter = filterStatus === "All" || a.status === filterStatus;
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || a.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      <header className="mb-10">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block animate-fade-in-down">Enrollment Hub</span>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-sjcs-on-surface">Admissions <span className="text-sjcs-primary">Desk</span></h1>
        <p className="mt-2 text-sjcs-on-surface-variant text-sm">Review parent inquiries, manage document verifications, and orchestrate automated communications.</p>
      </header>

      {/* Grid of Search, List and Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Filters + List */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Controls bar */}
          <div className="bg-sjcs-surface-container-lowest p-6 rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sjcs-on-surface-variant text-sm">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-sjcs-surface-container rounded-xl text-sm border-none focus:ring-2 focus:ring-sjcs-primary/20 transition-all outline-none"
                placeholder="Search applicant name, email..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
              {["All", "Pending", "Review", "Interview", "Approved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-label text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterStatus === status 
                      ? "leadership-gradient text-sjcs-on-primary shadow-md" 
                      : "bg-sjcs-surface-container hover:bg-sjcs-surface-container-high text-sjcs-on-surface-variant"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* List Card */}
          <div className="bg-sjcs-surface-container-lowest rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient overflow-hidden">
            {loading ? (
              <div className="flex py-20 items-center justify-center text-sjcs-on-surface-variant font-medium">
                Retrieving applications...
              </div>
            ) : filteredAdmissions.length === 0 ? (
              <div className="flex py-20 flex-col items-center justify-center text-sjcs-on-surface-variant text-sm uppercase tracking-wide gap-3">
                <span className="material-symbols-outlined text-4xl text-sjcs-primary/30">inbox</span>
                No admission dossiers found
              </div>
            ) : (
              <div className="divide-y divide-sjcs-outline-variant/10">
                {filteredAdmissions.map((a) => {
                  const isSelected = selectedAdmission?._id === a._id;
                  return (
                    <div
                      key={a._id}
                      onClick={() => handleSelectAdmission(a)}
                      className={`p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-sjcs-surface-container-low/40 ${
                        isSelected ? "bg-sjcs-primary-container/20 border-l-4 border-sjcs-primary" : ""
                      }`}
                    >
                      <div>
                        <h4 className="font-headline font-bold text-sm tracking-tight">{a.studentName}</h4>
                        <p className="text-xs text-sjcs-on-surface-variant mt-1">{a.email} • Grade {a.grade}</p>
                        <p className="text-[10px] text-sjcs-on-surface-variant/75 mt-2">Submitted {new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          a.status === "Pending" ? "bg-amber-100 text-amber-800" :
                          a.status === "Review" ? "bg-blue-100 text-blue-800" :
                          a.status === "Interview" ? "bg-purple-100 text-purple-800" :
                          a.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                          a.status === "Rejected" ? "bg-rose-100 text-rose-800" :
                          "bg-slate-100 text-slate-800"
                        }`}>
                          {a.status}
                        </span>
                        <span className="material-symbols-outlined text-sjcs-on-surface-variant/40 text-sm">chevron_right</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right column: Details and Actions */}
        <section className="lg:col-span-5">
          {selectedAdmission ? (
            <div className="bg-sjcs-surface-container-lowest p-8 rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient flex flex-col gap-6 sticky top-24">
              <header className="border-b border-sjcs-outline-variant/10 pb-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-sjcs-primary">Candidate Dossier</span>
                    <h3 className="font-headline text-2xl font-black mt-1 tracking-tight">{selectedAdmission.studentName}</h3>
                    <p className="text-xs text-sjcs-on-surface-variant mt-1">{selectedAdmission.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedAdmission.status === "Pending" ? "bg-amber-100 text-amber-800" :
                    selectedAdmission.status === "Review" ? "bg-blue-100 text-blue-800" :
                    selectedAdmission.status === "Interview" ? "bg-purple-100 text-purple-800" :
                    selectedAdmission.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                    "bg-rose-100 text-rose-800"
                  }`}>
                    {selectedAdmission.status}
                  </span>
                </div>
              </header>

              {/* Dossier contents */}
              <div className="space-y-4">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-1">Academic Grade</h5>
                  <p className="text-sm font-semibold">Applying for Grade {selectedAdmission.grade}</p>
                </div>

                {selectedAdmission.scheduledDateTime && (
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-1">Interview Details</h5>
                    <p className="text-sm font-semibold flex items-center gap-2 text-purple-700">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      {new Date(selectedAdmission.scheduledDateTime).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Uploded documents */}
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label mb-2">Supporting Documents</h5>
                  {selectedAdmission.documents?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAdmission.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-sjcs-surface-container hover:bg-sjcs-primary/5 transition-all border border-sjcs-outline-variant/10 text-xs font-semibold group"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="material-symbols-outlined text-sjcs-primary text-base">description</span>
                            <span className="truncate">{doc.fileName}</span>
                          </span>
                          <span className="material-symbols-outlined text-sjcs-secondary text-sm group-hover:translate-x-1 duration-200">download</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-sjcs-on-surface-variant/70">No transcripts or birth certificates uploaded.</p>
                  )}
                </div>
              </div>

              {/* Action State Machine Form */}
              <form onSubmit={handleUpdateStatus} className="border-t border-sjcs-outline-variant/10 pt-6 space-y-4">
                <h4 className="font-headline font-bold text-sm">Update Candidate Status</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Status Stage</label>
                    <select
                      className="w-full px-3 py-2 rounded-lg bg-sjcs-surface-container border-none text-xs font-semibold transition-all outline-none"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Review">In Review</option>
                      <option value="Interview">Schedule Interview</option>
                      <option value="Approved">Approve Dossier</option>
                      <option value="Rejected">Reject Dossier</option>
                    </select>
                  </div>

                  {newStatus === "Interview" && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Date &amp; Time</label>
                      <input
                        type="datetime-local"
                        required
                        className="w-full px-3 py-2 rounded-lg bg-sjcs-surface-container border-none text-xs font-semibold transition-all outline-none"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label flex justify-between">
                    <span>Internal Comments</span>
                    <span className="text-[8px] font-normal text-sjcs-on-surface-variant/65 italic">(triggers email templates on state change)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-sjcs-surface-container border-none text-xs font-semibold transition-all outline-none resize-none"
                    placeholder="Enter review decisions or feedback..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full leadership-gradient text-sjcs-on-primary py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {updating ? "Committing Updates..." : "Save Dossier Decision"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-sjcs-surface-container-lowest p-10 rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient text-center text-sjcs-on-surface-variant font-semibold">
              Select an applicant from the list to view their full credentials.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
