import { create } from "zustand";
import api from "@/lib/api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIState {
  messages: ChatMessage[];
  isLoading: boolean;
  suggestedPrompts: string[];

  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  askQuestion: (question: string, subject?: string) => Promise<void>;
}

const defaultPrompts = [
  "Explain the causes of World War I",
  "Help me solve a quadratic equation",
  "What are the key principles of Catholic social teaching?",
  "Summarize the Scholastic Method in philosophy",
  "How do I prepare for an AP exam?",
];

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isLoading: false,
  suggestedPrompts: defaultPrompts,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),

  askQuestion: async (question, subject) => {
    // 1. Instantly add user message to state
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
      // 2. Make API call to the RAG backend
      const { data } = await api.post("/ai/ask", { question, subject });
      const answer = data?.data?.answer || "I'm sorry, I couldn't process that request.";

      // 3. Add AI response to state
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error("AI Query Error:", error);
      
      const errorMessage = error.response?.data?.message 
        ? `Error: ${error.response.data.message}`
        : "I encountered an error while trying to fetch that information. Please try again later.";

      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, errorMsg],
        isLoading: false,
      }));
    }
  },
}));
