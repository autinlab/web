
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 z-20 p-3 bg-slate-800/50 hover:bg-slate-700 rounded-full text-white transition-colors border border-slate-600/50"
          aria-label="Close History"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto p-8 md:p-16">
            
            {/* Header */}
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Our Heritage</h2>
                <div className="w-24 h-1.5 bg-science-teal mx-auto rounded-full"></div>
                <p className="text-slate-300 max-w-3xl mx-auto mt-8 text-xl leading-relaxed font-light">
                    We continue to explore the frontiers of modeling and visualization, building upon a rich legacy of innovation in structural biology at Scripps Research.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch max-w-5xl mx-auto">
                
                {/* Art Olson Card */}
                <a 
                    href="https://ccsb.scripps.edu/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative bg-gradient-to-b from-slate-800 to-slate-800/50 p-10 rounded-3xl border border-slate-700 hover:border-science-purple transition-all hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center text-center transform hover:-translate-y-1 duration-300"
                >
                    <div className="absolute -top-4 bg-science-purple text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/10">
                        The Founder
                    </div>
                    <div className="w-32 h-32 rounded-full bg-slate-700 mb-8 border-4 border-slate-600 group-hover:border-science-purple transition-colors overflow-hidden flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-slate-500 group-hover:text-white transition-colors">AO</span>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-science-purple transition-colors">Art Olson</h3>
                    <p className="text-slate-300 text-base leading-relaxed">
                        Founder of the Molecular Graphics Laboratory (MGL). A pioneer who established the foundations of molecular visualization and physical modeling at Scripps Research, he remains a guiding inspiration for the lab.
                    </p>
                </a>

                {/* David Goodsell Card */}
                <a 
                    href="https://ccsb.scripps.edu/goodsell/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="group relative bg-gradient-to-b from-slate-800 to-slate-800/50 p-10 rounded-3xl border border-slate-700 hover:border-science-teal transition-all hover:shadow-[0_0_50px_rgba(45,212,191,0.15)] flex flex-col items-center text-center transform hover:-translate-y-1 duration-300"
                >
                    <div className="absolute -top-4 bg-science-teal text-slate-900 text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/10">
                        The Visionary
                    </div>
                    <div className="w-32 h-32 rounded-full bg-slate-700 mb-8 border-4 border-slate-600 group-hover:border-science-teal transition-colors overflow-hidden flex items-center justify-center shadow-xl">
                        <span className="text-3xl font-bold text-slate-500 group-hover:text-white transition-colors">DG</span>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-science-teal transition-colors">David Goodsell</h3>
                    <p className="text-slate-300 text-base leading-relaxed">
                        Renowned for his signature watercolor style, David continued the MGL legacy. Having retired from academia in January 2025, he now enjoys his garden and exploring new creative venues.
                    </p>
                </a>

            </div>

            {/* Connecting Line & Text */}
            <div className="mt-20 flex flex-col items-center text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-slate-700 to-science-teal"></div>
                <div className="mt-16 bg-science-dark border-2 border-science-teal rounded-full p-3 z-10 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                    <svg className="w-6 h-6 text-science-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
                <h3 className="text-3xl font-display font-bold text-white mt-8">Ludo's Molecular Graphics Lab</h3>
                <p className="text-slate-400 max-w-2xl mt-4 text-lg">
                    Inheriting this legacy, we are now developing the next generation of immersive technologies—from web-based explorers to GPU-accelerated simulations—to continue revealing the invisible.
                </p>
            </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default HistoryModal;
