import { create } from "zustand";

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
}));
