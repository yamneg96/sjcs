import { useState } from "react";

export function AIFab() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/support/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();

    const aiMsg = { role: "ai", content: data.answer };

    setMessages((prev) => [...prev, aiMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      
      {/* CHAT BOX */}
      {open && (
        <div className="w-80 h-96 bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden border">
          
          {/* Header */}
          <div className="leadership-gradient text-white p-3 font-bold">
            SJCS Assistant
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SJCS..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Tooltip + FAB */}
      <div className="relative">
        <div
          className={`absolute bottom-full right-0 mb-4 bg-card px-4 py-2 rounded-lg shadow-lg transition-all ${
            showTooltip
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <span className="text-xs font-bold text-red-600">
            SJCS AI Support
          </span>
        </div>

        <button
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="leadership-gradient text-white rounded-full h-16 w-16 flex flex-col items-center justify-center shadow-xl hover:scale-110 transition"
        >
          🤖
        </button>
      </div>
    </div>
  );
}