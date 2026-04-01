import { create } from "zustand";

export interface AdminTeacher {
  id: string;
  name: string;
  department: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Past";
  classesAssigned: number;
}

interface AdminTeacherState {
  teachers: AdminTeacher[];
  isLoading: boolean;
  error: string | null;
  fetchTeachers: () => Promise<void>;
  addTeacher: (teacher: Omit<AdminTeacher, "id">) => Promise<void>;
}

const MOCK_TEACHERS: AdminTeacher[] = [
  { id: "TCH-201", name: "Dr. Evelyn Vance", department: "Science", joinDate: "2018-08-15", status: "Active", classesAssigned: 4 },
  { id: "TCH-202", name: "Mr. Arthur Pendelton", department: "Mathematics", joinDate: "2015-08-10", status: "Active", classesAssigned: 5 },
  { id: "TCH-203", name: "Mrs. Clara Hughes", department: "History", joinDate: "2020-01-22", status: "On Leave", classesAssigned: 0 },
  { id: "TCH-204", name: "Fr. Thomas Aquinas", department: "Theology", joinDate: "2010-08-15", status: "Active", classesAssigned: 3 },
  { id: "TCH-205", name: "Ms. Sarah Jenkins", department: "English", joinDate: "2022-08-15", status: "Active", classesAssigned: 4 },
];

export const useAdminTeacherStore = create<AdminTeacherState>((set, get) => ({
  teachers: [],
  isLoading: false,
  error: null,

  fetchTeachers: async () => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ teachers: MOCK_TEACHERS, isLoading: false });
  },

  addTeacher: async (teacherData) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 700));
    const newTeacher = { ...teacherData, id: `TCH-${Math.floor(Math.random() * 1000) + 300}` };
    set({ teachers: [...get().teachers, newTeacher], isLoading: false });
  }
}));
