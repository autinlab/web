
import React from 'react';

const HistorySection: React.FC = () => {
  return (
    <section id="history" className="py-24 relative bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Our Heritage</h2>
          <div className="w-20 h-1 bg-science-teal mx-auto rounded-full"></div>
          <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-lg">
            We continue to explore the frontiers of modeling and visualization, building upon a rich legacy of innovation in structural biology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            
            {/* Art Olson Card */}
            <a 
                href="https://people.scripps.edu/~olson/" 
                target="_blank" 
                rel="noreferrer"
                className="group relative bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-science-purple/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col items-center text-center"
            >
                <div className="absolute -top-6 bg-science-purple text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    The Founder
                </div>
                <div className="w-24 h-24 rounded-full bg-slate-700 mb-6 border-4 border-slate-600 group-hover:border-science-purple transition-colors overflow-hidden flex items-center justify-center">
                     {/* Fallback initials */}
                     <span className="text-2xl font-bold text-slate-400 group-hover:text-white">AO</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-science-purple transition-colors">Art Olson</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Founder of the Molecular Graphics Laboratory (MGL). A pioneer who established the foundations of molecular visualization and physical modeling at Scripps Research.
                </p>
            </a>

            {/* David Goodsell Card */}
            <a 
                href="https://ccsb.scripps.edu/goodsell/" 
                target="_blank" 
                rel="noreferrer"
                className="group relative bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-science-teal/50 transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.15)] flex flex-col items-center text-center"
            >
                 <div className="absolute -top-6 bg-science-teal text-slate-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    The Visionary
                </div>
                <div className="w-24 h-24 rounded-full bg-slate-700 mb-6 border-4 border-slate-600 group-hover:border-science-teal transition-colors overflow-hidden flex items-center justify-center">
                     {/* Fallback initials */}
                     <span className="text-2xl font-bold text-slate-400 group-hover:text-white">DG</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-science-teal transition-colors">David Goodsell</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Renowned for his signature watercolor style, David continued the MGL legacy, bridging the gap between science and art to reveal the crowded interior of cells.
                </p>
            </a>

        </div>

        {/* Connecting Line & Text */}
        <div className="mt-16 flex flex-col items-center text-center">
             <div className="h-12 w-0.5 bg-gradient-to-b from-slate-700 to-science-teal"></div>
             <div className="bg-science-dark border border-science-teal/30 rounded-full p-2 mt-[-4px] z-10">
                <svg className="w-6 h-6 text-science-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
             </div>
             <h3 className="text-2xl font-display font-bold text-white mt-6">Ludo's Molecular Graphics Lab</h3>
             <p className="text-slate-400 max-w-2xl mt-4">
                Inheriting this legacy, we are now developing the next generation of immersive technologies—from web-based explorers to GPU-accelerated simulations—to continue revealing the invisible.
             </p>
        </div>

      </div>
    </section>
  );
};

export default HistorySection;