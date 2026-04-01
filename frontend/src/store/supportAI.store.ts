import { create } from "zustand";
import api from "@/lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface SupportAIState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;

  setOpen: (open: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  askSupportAI: (question: string) => Promise<void>;
}

export const useSupportAIStore = create<SupportAIState>((set) => ({
  messages: [],
  isLoading: false,
  isOpen: false,

  setOpen: (open) => set({ isOpen: open }),
  
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
    
  clearMessages: () => set({ messages: [] }),

  askSupportAI: async (question) => {
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
    }));

    try {
      const { data } = await api.post("/support/ask", { question });
      
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.data.answer || "I'm sorry, I couldn't process that question.",
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("Support AI Error:", error);
      
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: error.response?.data?.message || "I'm having trouble connecting. Please try again or contact the office.",
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, errorMsg],
        isLoading: false,
      }));
    }
  },
}));
