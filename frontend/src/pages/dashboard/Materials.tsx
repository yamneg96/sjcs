import { useState, useEffect } from "react";
import api from "@/lib/api";

interface ISubject {
  _id: string;
  name: string;
  code: string;
  grade: number;
}

interface IMaterial {
  _id: string;
  title: string;
  materialType: "pdf" | "video" | "markdown" | "link";
  contentUrl?: string;
  subjectId: { _id: string; name: string } | string;
  createdAt: string;
}

export default function MaterialsPage() {
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [materialType, setMaterialType] = useState<"pdf" | "video" | "markdown" | "link">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [directLink, setDirectLink] = useState(""); // if video/link type
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const subRes = await api.get("/subjects");
      setSubjects(subRes.data?.data || []);

      const matRes = await api.get("/materials");
      setMaterials(matRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load materials / subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId) {
      alert("Title and Subject are required.");
      return;
    }

    setSubmitting(true);
    setUploadProgress("");

    try {
      let finalUrl = directLink;

      // 1. If file is present, upload via R2 Storage route first
      if (materialType === "pdf" && file) {
        setUploading(true);
        setUploadProgress("Uploading file to Cloudflare R2...");
        
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await api.post("/storage/upload/public", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        finalUrl = uploadRes.data?.data?.fileUrl;
        setUploading(false);
        setUploadProgress("File uploaded successfully!");
      }

      if (materialType === "pdf" && !finalUrl) {
        alert("Please select a PDF file to upload.");
        setSubmitting(false);
        return;
      }

      // 2. Submit material document to Materials API
      const payload = {
        title,
        subjectId,
        materialType,
        contentUrl: finalUrl,
      };

      const res = await api.post("/materials", payload);
      setMaterials([res.data?.data, ...materials]);

      // Reset form
      setTitle("");
      setFile(null);
      setDirectLink("");
      alert("Lesson material published successfully! Synced to Mobile client.");
    } catch (err) {
      console.error("Publishing failed:", err);
      alert("Error: Failed to publish material.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this academic resource?")) return;

    try {
      await api.delete(`/materials/${id}`);
      setMaterials(materials.filter(m => m._id !== id));
      alert("Material removed.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete lesson material.");
    }
  };

  return (
    <main className="min-h-screen">
      <header className="mb-10 animate-fade-in-down">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">Materials Hub</span>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-sjcs-on-surface">Curriculum <span className="text-sjcs-primary">Repository</span></h1>
        <p className="mt-2 text-sjcs-on-surface-variant text-sm">Upload syllabi, text book chapters, and support links. PDF files are saved to R2 storage for offline mobile caching.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Publish form panel */}
        <section className="lg:col-span-5 bg-sjcs-surface-container-lowest p-8 rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient">
          <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-sjcs-primary">publish</span>
            Add Lesson Resource
          </h3>
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Material Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                placeholder="e.g. Summa Theologiae Vol. I"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Academic Subject</label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  <option value="">Select subject...</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} (Grade {sub.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Resource Type</label>
                <select
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                >
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video URL</option>
                  <option value="link">Web Page Link</option>
                  <option value="markdown">Markdown Text</option>
                </select>
              </div>
            </div>

            {/* Input toggle depending on type */}
            {materialType === "pdf" ? (
              <div className="space-y-2 border-2 border-dashed border-sjcs-outline-variant/15 p-6 rounded-xl text-center bg-sjcs-surface-container/30 hover:bg-sjcs-surface-container-high transition-all">
                <span className="material-symbols-outlined text-4xl text-sjcs-secondary mb-2">upload_file</span>
                <p className="text-xs text-sjcs-on-surface-variant">Select PDF document syllabus to sync (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-file-picker"
                />
                <label
                  htmlFor="pdf-file-picker"
                  className="mt-3 inline-block cursor-pointer bg-sjcs-surface-container text-sjcs-on-surface px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-sjcs-outline-variant/20 transition-all"
                >
                  Choose File
                </label>
                {file && (
                  <p className="text-xs font-bold text-sjcs-primary mt-2 truncate">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-sjcs-on-surface-variant font-label">Content URL / Value</label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-sjcs-primary/20"
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  value={directLink}
                  onChange={(e) => setDirectLink(e.target.value)}
                />
              </div>
            )}

            {uploadProgress && (
              <div className="text-xs font-semibold text-sjcs-secondary p-3 bg-sjcs-primary-container/20 rounded-xl border border-sjcs-primary/10">
                {uploadProgress}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full leadership-gradient text-sjcs-on-primary py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              {uploading ? "Uploading File..." : submitting ? "Processing Resource..." : "Publish Material & Sync"}
            </button>
          </form>
        </section>

        {/* Materials list review panel */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="font-headline font-bold text-lg">Active Resouces</h3>
          <div className="bg-sjcs-surface-container-lowest rounded-2xl border border-sjcs-outline-variant/10 shadow-ambient overflow-hidden">
            {loading ? (
              <div className="text-center py-20 text-xs text-sjcs-on-surface-variant/75 font-semibold">
                Retrieving active curriculum...
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-20 text-xs text-sjcs-on-surface-variant/75 font-semibold flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-sjcs-primary/30">folder_zip</span>
                Repository is currently empty.
              </div>
            ) : (
              <div className="divide-y divide-sjcs-outline-variant/10">
                {materials.map((m) => {
                  const subjectName = typeof m.subjectId === "object" ? m.subjectId.name : "Subject";
                  return (
                    <div key={m._id} className="p-5 flex justify-between items-center hover:bg-sjcs-surface-container-low/40 transition-colors group">
                      <div className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-sjcs-on-surface-variant group-hover:text-sjcs-secondary duration-200">
                          {m.materialType === "pdf" ? "picture_as_pdf" : m.materialType === "video" ? "movie" : "link"}
                        </span>
                        <div className="truncate">
                          <h4 className="text-xs font-black text-sjcs-on-surface truncate leading-tight">{m.title}</h4>
                          <p className="text-[10px] text-sjcs-on-surface-variant mt-0.5">{subjectName} • Type: {m.materialType.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        {m.contentUrl && (
                          <a
                            href={m.contentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-sjcs-secondary hover:underline flex items-center gap-1"
                          >
                            Preview
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
                          title="Delete Resource"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
