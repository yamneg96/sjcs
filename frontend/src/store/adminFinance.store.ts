import { create } from "zustand";

export interface Transaction {
  id: string;
  studentName: string;
  amount: number;
  date: string;
  type: "Tuition" | "Extracurricular" | "Donation" | "Fee";
  status: "Completed" | "Pending" | "Failed";
}

interface AdminFinanceState {
  transactions: Transaction[];
  monthlyRevenue: number;
  outstandingDues: number;
  isLoading: boolean;
  error: string | null;
  fetchFinanceData: () => Promise<void>;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-9021", studentName: "Julian Mercer", amount: 1500.00, date: new Date().toISOString().split('T')[0], type: "Tuition", status: "Completed" },
  { id: "TXN-9022", studentName: "Sophia Marie", amount: 1500.00, date: new Date().toISOString().split('T')[0], type: "Tuition", status: "Completed" },
  { id: "TXN-9023", studentName: "Marcus Thorne", amount: 250.00, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], type: "Extracurricular", status: "Pending" },
  { id: "TXN-9024", studentName: "Elena Rostova", amount: 1500.00, date: new Date(Date.now() - 172800000).toISOString().split('T')[0], type: "Tuition", status: "Completed" },
  { id: "TXN-9025", studentName: "Anonymous", amount: 5000.00, date: new Date(Date.now() - 259200000).toISOString().split('T')[0], type: "Donation", status: "Completed" },
];

export const useAdminFinanceStore = create<AdminFinanceState>((set) => ({
  transactions: [],
  monthlyRevenue: 0,
  outstandingDues: 0,
  isLoading: false,
  error: null,

  fetchFinanceData: async () => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ 
      transactions: MOCK_TRANSACTIONS, 
      monthlyRevenue: 125400.00, 
      outstandingDues: 18500.00,
      isLoading: false 
    });
  }
}));
