import { create } from "zustand";

interface StudySession {
  sessionId: string;
  subject: string;
  startedAt: string;
  isActive: boolean;
}

interface StudyLog {
  _id: string;
  question: string;
  answer: string;
  subject: string;
  gradeAccessed: number;
  createdAt: string;
}

interface LISState {
  currentSession: StudySession | null;
  studyLogs: StudyLog[];
  isLoading: boolean;

  setSession: (session: StudySession | null) => void;
  setStudyLogs: (logs: StudyLog[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useLISStore = create<LISState>((set) => ({
  currentSession: null,
  studyLogs: [],
  isLoading: false,

  setSession: (session) => set({ currentSession: session }),
  setStudyLogs: (logs) => set({ studyLogs: logs }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
