import { create } from "zustand";

interface MaterialsState {
  materials: any[];
  isLoading: boolean;
  error: string | null;
  uploadMaterial: (file: File, grade: number, subject: string, title?: string) => Promise<void>;
}

export const useMaterialsStore = create<MaterialsState>((set) => ({
  materials: [],
  isLoading: false,
  error: null,
  
  uploadMaterial: async (file, grade, subject, title) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("grade", grade.toString());
      formData.append("subject", subject);
      if (title) formData.append("title", title);

      const res = await fetch("/api/materials/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` 
          // Note: Omitting Content-Type so browser sets boundary for multipart/form-data
        },
        body: formData
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Upload failed");
      }
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  }
}));
