import React from 'react';

const FloatingCapsid: React.FC<{ size: number; top: string; left: string; delay: string; color: string }> = ({
  size,
  top,
  left,
  delay,
  color,
}) => (
  <div
    className={`absolute opacity-30 pointer-events-none animate-float`}
    style={{
      top,
      left,
      width: size,
      height: size,
      animationDelay: delay,
      color: color,
    }}
  >
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Simplified Icosahedron Projection */}
        <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" />
        <path d="M50 5 L50 50 L90 72" />
        <path d="M50 50 L10 72" />
        <path d="M10 28 L50 50 L90 28" />
        <circle cx="50" cy="50" r="2" fill="currentColor"/>
    </svg>
  </div>
);

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <FloatingCapsid size={200} top="15%" left="10%" delay="0s" color="#2dd4bf" />
      <FloatingCapsid size={150} top="60%" left="80%" delay="2s" color="#a855f7" />
      <FloatingCapsid size={80} top="70%" left="15%" delay="1s" color="#2dd4bf" />
      <FloatingCapsid size={120} top="20%" left="70%" delay="3s" color="#a855f7" />

      <div className="container mx-auto px-6 text-center z-10">
        <div className="mb-8 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-science-teal/20 rounded-full"></div>
                 <img 
                    src="assets/lab_logo_text.png" 
                    alt="Lab Logo Text" 
                    className="h-32 relative z-10 object-contain"
                    onError={(e) => {
                         e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        </div>
        
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Exploring the <span className="text-transparent bg-clip-text bg-gradient-to-r from-science-teal to-science-purple">Inner Life</span> <br />
          of Cells
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
          Welcome to LUDO's LAB at <a href="http://scripps.edu/" target="_blank" rel="noopener noreferrer">Scripps Research</a>. One of the members of the <a href="http://ccsb.scripps.edu/" target="_blank" rel="noopener noreferrer">Center for Computational Structural Biology (CCSB)</a>, we build the next generation of tools to model, simulate, and paint the molecular world. From CellPack to Mesoscope.
        </p>

        <a 
          href="#software"
          className="inline-flex items-center gap-2 bg-science-teal/10 hover:bg-science-teal/20 text-science-teal border border-science-teal/50 px-8 py-3 rounded-full transition-all transform hover:scale-105 backdrop-blur-sm"
        >
          Explore Our Tools
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
      
      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;