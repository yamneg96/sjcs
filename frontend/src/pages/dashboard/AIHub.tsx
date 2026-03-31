import { useState } from "react";
import { useAIStore } from "@/store/ai.store";

export default function AIHubPage() {
  const [input, setInput] = useState("");
  const { messages, addMessage, suggestedPrompts, isLoading, setLoading } = useAIStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user" as const, content: input, timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    // Mock AI response
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thank you for your question. The SJCS AI Learning Assistant is being configured with the RAG pipeline. Once active, I will provide curriculum-specific responses drawn from your course materials, textbooks, and academic resources. Your question has been logged for your study history.",
        timestamp: new Date().toISOString(),
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-8">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-sjcs-secondary font-bold mb-2 block">AI Learning Hub</span>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-sjcs-on-surface">SJCS <span className="text-sjcs-primary">AI Assistant</span></h1>
        <p className="mt-2 text-sjcs-on-surface-variant">Ask questions, get explanations, and generate study quizzes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chat Area */}
        <div className="lg:col-span-3 bg-sjcs-surface-container-lowest rounded-xl shadow-ambient flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-sjcs-primary/20 mb-4">smart_toy</span>
                <h3 className="font-headline text-2xl font-bold mb-4">How can I help you today?</h3>
                <p className="text-sjcs-on-surface-variant mb-8">Choose a suggested prompt or type your own question.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {suggestedPrompts.slice(0, 4).map((prompt) => (
                    <button key={prompt} onClick={() => setInput(prompt)} className="text-left p-4 bg-sjcs-surface-container-low rounded-xl text-sm text-sjcs-on-surface-variant hover:bg-sjcs-surface-container transition-colors">
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-4 rounded-xl ${msg.role === "user" ? "leadership-gradient text-white" : "bg-sjcs-surface-container"}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-sjcs-surface-container p-4 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-sjcs-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sjcs-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-sjcs-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-sjcs-surface-container">
            <div className="flex gap-4">
              <input
                className="flex-1 px-4 py-3 rounded-lg bg-sjcs-surface-container-low border-none focus:ring-2 focus:ring-sjcs-secondary transition-all outline-none"
                placeholder="Ask a question about your curriculum..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} className="leadership-gradient text-white px-6 py-3 rounded-lg font-bold text-sm active:scale-95 transition-transform">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-6 shadow-ambient">
            <h3 className="font-headline font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: "quiz", label: "Generate Quiz", color: "text-sjcs-primary" },
                { icon: "summarize", label: "Explain Concept", color: "text-sjcs-secondary" },
                { icon: "record_voice_over", label: "Voice Output", color: "text-sjcs-tertiary" },
              ].map((action) => (
                <button key={action.label} className="w-full flex items-center gap-3 p-3 rounded-lg bg-sjcs-surface-container-low hover:bg-sjcs-surface-container transition-colors text-left">
                  <span className={`material-symbols-outlined ${action.color}`}>{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-sjcs-surface-container-lowest rounded-xl p-6 shadow-ambient">
            <h3 className="font-headline font-bold mb-4">Subjects</h3>
            <div className="space-y-2">
              {["Mathematics", "Philosophy", "History", "Theology", "Science"].map((sub) => (
                <button key={sub} className="w-full text-left p-2 rounded-lg text-sm text-sjcs-on-surface-variant hover:text-sjcs-primary hover:bg-sjcs-surface-container-low transition-colors">
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
