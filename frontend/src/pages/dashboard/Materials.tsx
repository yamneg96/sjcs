import React, { useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { useSubjects } from "@/hooks/use-subjects";
import { useMaterials, useCreateMaterial, useDeleteMaterial, useUploadFile } from "@/hooks/use-materials";
import type { MaterialType } from "@/types/api.types";

export default function MaterialsPage() {
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const { data: materials = [], isLoading: loadingMaterials } = useMaterials();

  const { mutateAsync: createMaterial, isPending: submitting } = useCreateMaterial();
  const { mutateAsync: deleteMaterial } = useDeleteMaterial();
  const { mutateAsync: uploadFile, isPending: uploading } = useUploadFile();

  // Upload Form State
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [materialType, setMaterialType] = useState<MaterialType>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [directLink, setDirectLink] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId) {
      alert("Title and Subject category selection are required.");
      return;
    }

    setUploadProgress("");

    try {
      let finalUrl = directLink;

      // 1. If file is present and type is pdf, upload via storage route first
      if (materialType === "pdf" && file) {
        setUploadProgress("Uploading file to Cloudflare R2...");
        const uploadRes = await uploadFile(file);
        finalUrl = uploadRes.data.data.fileUrl;
        setUploadProgress("File uploaded successfully!");
      }

      if (materialType === "pdf" && !finalUrl) {
        alert("Please select a PDF file to upload.");
        return;
      }

      // 2. Submit material document to Materials API
      await createMaterial({
        title,
        subjectId,
        materialType,
        contentUrl: finalUrl || undefined,
      });

      alert("Lesson material published successfully and cached for mobile learners!");
      setTitle("");
      setFile(null);
      setDirectLink("");
      setUploadProgress("");
    } catch (err) {
      alert("Failed to publish resource: " + getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this academic resource?")) return;

    try {
      await deleteMaterial(id);
      alert("Material removed.");
    } catch (err) {
      alert("Failed to delete lesson material: " + getErrorMessage(err));
    }
  };

  const loading = loadingSubjects || loadingMaterials;

  return (
    <main className="min-h-screen animate-fade-in text-foreground">
      <header className="mb-10">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block">
          Materials Hub
        </span>
        <h1 className="font-headline text-4xl font-black tracking-tight text-foreground">
          Curriculum <span className="text-primary">Repository</span>
        </h1>
        <p className="mt-2 text-muted-foreground text-sm max-w-xl">
          Publish syllabi, textbook chapters, and support links. PDF files are saved to Cloudflare R2 key stores for offline mobile caching.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Publish form panel */}
        <section className="lg:col-span-5 bg-card p-6 md:p-8 rounded-2xl border border-border/10 shadow-ambient">
          <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">publish</span>
            Add Lesson Resource
          </h3>
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Material Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Summa Theologiae Vol. I"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Academic Subject</label>
                <select
                  required
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Resource Type</label>
                <select
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as MaterialType)}
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
              <div className="space-y-2 border-2 border-dashed border-border/15 p-6 rounded-xl text-center bg-sjcs-surface-container/30 hover:bg-sjcs-surface-container-high transition-all">
                <span className="material-symbols-outlined text-4xl text-secondary mb-2">upload_file</span>
                <p className="text-xs text-muted-foreground">Select PDF document syllabus to sync (Max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-file-picker"
                />
                <label
                  htmlFor="pdf-file-picker"
                  className="mt-3 inline-block cursor-pointer bg-sjcs-surface-container text-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-border/20 transition-all border border-border/10"
                >
                  Choose File
                </label>
                {file && (
                  <p className="text-xs font-bold text-primary mt-2 truncate">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Content URL / Value</label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-2.5 bg-sjcs-surface-container rounded-xl text-xs font-semibold border-none outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  value={directLink}
                  onChange={(e) => setDirectLink(e.target.value)}
                />
              </div>
            )}

            {uploadProgress && (
              <div className="text-xs font-semibold text-secondary p-3 bg-primary/5 rounded-xl border border-primary/10">
                {uploadProgress}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full leadership-gradient text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              {uploading ? "Uploading File..." : submitting ? "Processing Resource..." : "Publish Material & Sync"}
            </button>
          </form>
        </section>

        {/* Materials list review panel */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="font-headline font-bold text-lg text-foreground">Active Resources</h3>
          <div className="bg-card rounded-2xl border border-border/10 shadow-ambient overflow-hidden">
            {loading ? (
              <div className="text-center py-20 text-xs text-muted-foreground font-semibold">
                <div className="animate-pulse">Retrieving active curriculum...</div>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-20 text-xs text-muted-foreground font-semibold flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-primary/30">folder_zip</span>
                Repository is currently empty.
              </div>
            ) : (
              <div className="divide-y divide-border/10 animate-fade-in">
                {materials.map((m) => {
                  const subjectName = typeof m.subjectId === "object" ? m.subjectId.name : "Subject";
                  return (
                    <div key={m._id} className="p-5 flex justify-between items-center hover:bg-muted/20 transition-colors group">
                      <div className="flex items-center gap-3 truncate">
                        <span className="material-symbols-outlined text-muted-foreground group-hover:text-secondary duration-200">
                          {m.materialType === "pdf" ? "picture_as_pdf" : m.materialType === "video" ? "movie" : "link"}
                        </span>
                        <div className="truncate">
                          <h4 className="text-xs font-black text-foreground truncate leading-tight">{m.title}</h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {subjectName} • Type: {m.materialType.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        {m.contentUrl && (
                          <a
                            href={m.contentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                          >
                            Preview
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sjcs-surface-container text-rose-500 transition-colors"
                          title="Delete Resource"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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
