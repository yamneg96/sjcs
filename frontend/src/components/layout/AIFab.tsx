import { useState, useRef, useEffect } from "react";
import { useSupportAIStore } from "@/store/supportAI.store";

export function AIFab() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { messages, isLoading, isOpen, setOpen, askSupportAI } = useSupportAIStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    await askSupportAI(question);
  };

  return (
    <div className="fixed bottom-8 right-8 z-100 flex flex-col items-end gap-4">
      
      {/* CHAT BOX */}
      {isOpen && (
        <div className="w-[350px] h-[500px] min-w-[320px] min-h-[400px] max-w-[calc(100vw-4rem)] max-h-[calc(100vh-8rem)] glass dark:glass-dark border border-sjcs-outline-variant/30 shadow-ambient rounded-2xl flex flex-col lg:resize lg:overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="leadership-gradient text-sjcs-on-primary p-5 flex justify-between items-center bg-sjcs-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <span className="material-symbols-outlined text-white text-xl">smart_toy</span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">SJCS Digital Assistant</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Always ready to help</p>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white text-lg">close</span>
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 p-5 overflow-y-auto space-y-4 bg-background/50 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 px-6">
                <span className="material-symbols-outlined text-4xl mb-4">chat_bubble</span>
                <p className="text-xs font-medium">Hello! Ask me anything about SJCS admissions, schedules, or general inquiries.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end text-right" : "justify-start text-left"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "leadership-gradient text-sjcs-on-primary rounded-tr-none"
                      : "bg-sjcs-surface-container-high text-sjcs-on-surface rounded-tl-none border border-sjcs-outline-variant/10"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-sjcs-surface-container-high p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-sjcs-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-sjcs-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1.5 h-1.5 bg-sjcs-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                 </div>
               </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-sjcs-surface-container-low border-t border-sjcs-outline-variant/10">
            <div className="flex gap-2 bg-sjcs-surface-container-lowest p-1.5 rounded-xl border border-sjcs-outline-variant/20 shadow-sm focus-within:ring-2 focus-within:ring-sjcs-secondary focus-within:border-transparent transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-transparent border-none px-3 py-2 text-sm outline-none placeholder:text-sjcs-on-surface-variant/40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 leadership-gradient text-sjcs-on-primary rounded-lg flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
            <p className="text-[9px] text-center mt-3 text-sjcs-on-surface-variant/50 font-medium">Powered by SJCS AI System</p>
          </div>
        </div>
      )}

      {/* Tooltip + FAB */}
      <div className="relative">
        <div
          className={`absolute bottom-full right-0 mb-4 bg-white/90 backdrop-blur-md border border-sjcs-outline-variant/20 px-4 py-2 rounded-xl shadow-ambient transition-all duration-500 scale-90 origin-bottom-right ${
            showTooltip && !isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <span className="text-[10px] font-black text-sjcs-primary uppercase tracking-[0.2em] whitespace-nowrap">
            Support is Online
          </span>
        </div>

        <button
          onClick={() => setOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`leadership-gradient text-sjcs-on-primary rounded-full h-16 w-16 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group overflow-hidden ${
            isOpen ? "rotate-90" : "rotate-0 shadow-[0_0_20px_rgba(175,16,26,0.2)]"
          }`}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isOpen ? (
            <span className="material-symbols-outlined text-2xl font-bold">close</span>
          ) : (
            <span className="material-symbols-outlined text-3xl font-bold animate-pulse">smart_toy</span>
          )}
        </button>
      </div>
    </div>
  );
}