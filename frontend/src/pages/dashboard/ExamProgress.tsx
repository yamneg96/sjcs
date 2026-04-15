import { useEffect, useRef, useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import JXG from 'jsxgraph';
import { ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, RotateCcw, Calculator } from 'lucide-react';

export default function GeometryExamModule() {
  const boardInstance = useRef<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ area: "0.00", isEquilateral: false });

  // --- JSXGraph Initialization ---
  const initBoard = useCallback(() => {
    const container = document.getElementById('jxgbox');
    if (!container) return;

    if (boardInstance.current) {
      JXG.JSXGraph.freeBoard(boardInstance.current);
      boardInstance.current = null;
    }

    const board = JXG.JSXGraph.initBoard('jxgbox', {
      boundingbox: [-4, 4, 4, -4],
      axis: true,
      showCopyright: false,
      grid: true,
      defaultAxes: {
        // x: { grid: { strokeColor: '#f1f5f9', opacity: 0.8 } },
        // y: { grid: { strokeColor: '#f1f5f9', opacity: 0.8 } }
      },
      pan: { enabled: false },
      // zoom: { enabled: false }
    });

    const center = board.create('point', [0, 0], { visible: false, fixed: true });
    board.create('circle', [center, 3], { strokeColor: '#f43f5e', strokeWidth: 2, fillOpacity: 0.05, fixed: true });

    const a = board.create('point', [-2.6, -1.5], { name: 'A', color: '#2563eb', size: 4 });
    const b = board.create('point', [2.6, -1.5], { name: 'B', color: '#2563eb', size: 4 });
    const c = board.create('point', [0, 3], { name: 'C', color: '#2563eb', size: 4 });
    const poly = board.create('polygon', [a, b, c], { fillColor: '#3b82f6', fillOpacity: 0.1 });

    board.on('update', () => {
      const area = poly.Area();
      const s1 = a.Dist(b);
      const s2 = b.Dist(c);
      const s3 = c.Dist(a);
      const avg = (s1 + s2 + s3) / 3;
      const dev = (Math.abs(s1 - avg) + Math.abs(s2 - avg) + Math.abs(s3 - avg)) / 3;

      setMetrics({
        area: area.toFixed(2),
        isEquilateral: dev < 0.1
      });
    });

    boardInstance.current = board;
  }, []);

  useEffect(() => {
    const timer = setTimeout(initBoard, 100);
    return () => {
      clearTimeout(timer);
      if (boardInstance.current) JXG.JSXGraph.freeBoard(boardInstance.current);
    };
  }, [initBoard]);

  const options = [
    { id: 'a', label: "9.00 units²", value: 9.0 },
    { id: 'b', label: "11.69 units²", value: 11.69 },
    { id: 'c', label: "14.14 units²", value: 14.14 },
    { id: 'd', label: "18.00 units²", value: 18.0 }
  ];

  return (
    <div className="space-y-8">
        
        {/* PROGRESS HEADER */}
        <div className="flex justify-between items-center bg-white p-6 mt-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              {currentStep}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Question {currentStep} of 10</h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Mathematics: Plane Geometry</p>
            </div>
          </div>
          <div className="hidden md:block w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(currentStep / 10) * 100}%` }} />
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT: THE INTERACTIVE FIGURE */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden relative">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Calculator size={14} className="text-blue-500" /> Interactive Figure 1.1
                </span>
                <button onClick={initBoard} className="text-slate-400 hover:text-blue-600 transition-colors">
                  <RotateCcw size={18} />
                </button>
              </div>
              
              <div id="jxgbox" className="w-full h-[450px] bg-white jxgbox" />

              {/* LIVE AREA DISPLAY */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl flex justify-between items-center text-white border border-white/10 shadow-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Current Inscribed Area</span>
                    <span className="text-2xl font-bold tabular-nums text-blue-400">{metrics.area} <span className="text-xs text-slate-500">u²</span></span>
                  </div>
                  {metrics.isEquilateral && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-3 py-1.5 rounded-full animate-pulse">
                      <CheckCircle2 size={14} /> NEAR OPTIMUM
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: THE MCQ QUESTION */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-200">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <HelpCircle size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Problem Statement</span>
              </div>
              
              <p className="text-slate-700 font-medium leading-relaxed mb-6">
                Determine the maximum possible area of a triangle inscribed within the circle defined by <InlineMath math="x^2 + y^2 = 9" />. Use the interactive figure to test various configurations.
              </p>

              <div className="space-y-3">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-sm font-semibold ${
                      selectedOption === opt.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                        selectedOption === opt.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        {opt.id.toUpperCase()}
                      </span>
                      {opt.label}
                    </div>
                    {selectedOption === opt.id && <CheckCircle2 size={18} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION FOOTER */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200 shadow-lg">
          <button 
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <div className="hidden sm:flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className={`h-1.5 w-1.5 rounded-full ${num === currentStep ? 'bg-blue-600 w-6' : 'bg-slate-200'}`} />
            ))}
          </div>

          <button 
            onClick={() => setCurrentStep(prev => Math.min(10, prev + 1))}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            {currentStep === 10 ? 'Submit Exam' : 'Next Question'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
  );
}




// JSX Graph Writing rule
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';

// export default function ExamProgressPage() {
//   return (
//     <main className="pt-32 pb-20 px-8 max-w-4xl mx-auto min-h-screen">
//       {/* ... (Previous Header and Progress Bar code remains the same) ... */}

//       <div className="bg-sjcs-surface-container-lowest rounded-xl p-10 shadow-ambient mb-8">
//         <h2 className="font-headline text-xl font-bold mb-4 text-sjcs-primary border-b pb-2">
//           Formula Reference (KaTeX Examples)
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Circles */}
//           <div className="p-4 border rounded-lg">
//             <p className="font-bold mb-2">Circles</p>
//             <InlineMath math="A = \pi r^2" /> <br/>
//             <InlineMath math="C = 2\pi r" /> <br/>
//             <InlineMath math="(x-h)^2 + (y-k)^2 = r^2" />
//           </div>

//           {/* Trigonometry */}
//           <div className="p-4 border rounded-lg">
//             <p className="font-bold mb-2">Trigonometry</p>
//             <InlineMath math="\sin^2\theta + \cos^2\theta = 1" /> <br/>
//             <InlineMath math="\tan\theta = \frac{\sin\theta}{\cos\theta}" />
//           </div>

//           {/* Geometry (Planes) */}
//           <div className="p-4 border rounded-lg">
//             <p className="font-bold mb-2">Triangles & Rectangles</p>
//             <InlineMath math="A = \frac{1}{2}bh" /> <br/>
//             <InlineMath math="c = \sqrt{a^2 + b^2}" /> <br/>
//             <InlineMath math="A = l \times w" />
//           </div>

//           {/* Calculus (Your Current Question) */}
//           <div className="p-4 border rounded-lg">
//             <p className="font-bold mb-2">Calculus</p>
//             <BlockMath math="\frac{d}{dx}[x^n] = nx^{n-1}" />
//           </div>
//         </div>
//       </div>

//       {/* ... (Previous Question 16 and Buttons code remains the same) ... */}
//     </main>
//   );
// }

