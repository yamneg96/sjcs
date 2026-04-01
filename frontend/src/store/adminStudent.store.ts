import { create } from "zustand";

export interface AdminStudent {
  id: string;
  name: string;
  grade: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Suspended";
  performanceMetrics: {
    gpa: number;
    attendance: string;
  };
}

interface AdminStudentState {
  students: AdminStudent[];
  isLoading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  suspendStudent: (id: string) => Promise<void>;
}

// Mock Database
const MOCK_STUDENTS: AdminStudent[] = [
  { id: "STU-1001", name: "Julian Mercer", grade: "Grade 11", enrollmentDate: "2024-08-15", status: "Active", performanceMetrics: { gpa: 3.8, attendance: "98%" } },
  { id: "STU-1002", name: "Sophia Marie", grade: "Grade 9", enrollmentDate: "2024-08-15", status: "Active", performanceMetrics: { gpa: 4.0, attendance: "100%" } },
  { id: "STU-1003", name: "Marcus Thorne", grade: "Grade 12", enrollmentDate: "2023-08-10", status: "Inactive", performanceMetrics: { gpa: 2.4, attendance: "75%" } },
  { id: "STU-1004", name: "Elena Rostova", grade: "Grade 10", enrollmentDate: "2024-01-22", status: "Active", performanceMetrics: { gpa: 3.5, attendance: "92%" } },
  { id: "STU-1005", name: "David Chen", grade: "Grade 11", enrollmentDate: "2024-08-15", status: "Active", performanceMetrics: { gpa: 3.9, attendance: "96%" } },
];

export const useAdminStudentStore = create<AdminStudentState>((set, get) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async () => {
    set({ isLoading: true, error: null });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ students: MOCK_STUDENTS, isLoading: false });
  },

  suspendStudent: async (id: string) => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    const updated = get().students.map(s => s.id === id ? { ...s, status: "Suspended" as const } : s);
    set({ students: updated, isLoading: false });
  }
}));
