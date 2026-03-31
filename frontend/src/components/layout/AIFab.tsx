import { useState } from "react";

export function AIFab() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <div className="relative">
        {/* Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-4 bg-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap transition-all duration-300 ${
            showTooltip
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <span className="font-headline uppercase tracking-widest text-[10px] text-sjcs-primary font-bold">
            SJCS AI Active
          </span>
          <p className="text-[10px] text-sjcs-on-surface-variant font-body">
            Academic Leadership Bot
          </p>
        </div>

        {/* FAB Button */}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="leadership-gradient text-white rounded-full h-16 w-16 flex flex-col items-center justify-center shadow-2xl shadow-red-900/20 hover:scale-110 hover:rotate-3 transition-all duration-300 active:scale-90 overflow-hidden"
          aria-label="SJCS AI Assistant"
        >
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
          <span className="font-headline uppercase tracking-widest text-[8px] mt-0.5">
            SJCS AI
          </span>
        </button>
      </div>
    </div>
  );
}
