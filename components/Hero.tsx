
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
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <FloatingCapsid size={200} top="15%" left="10%" delay="0s" color="#2dd4bf" />
      <FloatingCapsid size={150} top="60%" left="80%" delay="2s" color="#a855f7" />
      <FloatingCapsid size={80} top="70%" left="15%" delay="1s" color="#2dd4bf" />
      <FloatingCapsid size={120} top="20%" left="70%" delay="3s" color="#a855f7" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-10 md:mb-14 leading-tight text-center">
            Exploring the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-science-teal to-science-purple">
              Inner Life
            </span>{" "}
            <br className="hidden md:block" />
            of Cells
          </h1>

          {/* Logos + Text */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-14 max-w-5xl mx-auto">
            {/* Left: Ludo's MGL Logo */}
            <div className="flex-shrink-0">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-3xl p-[2px] bg-gradient-to-br from-science-teal/60 to-science-purple/60 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
                <div className="w-full h-full rounded-3xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-center backdrop-blur-md transition-transform duration-500 hover:scale-105 overflow-hidden">
                  <img 
                    src="assets/Logo1.gif" 
                    alt="Ludo's MGL Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const target = e.currentTarget;
                        const parent = target.parentElement;
                        target.style.display = 'none';
                        if (parent) {
                            parent.innerText = 'MGL';
                            parent.classList.add('text-science-teal', 'font-display', 'font-bold', 'text-6xl');
                        }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Center: Intro text */}
            <div className="max-w-xl">
              <p className="text-slate-200 text-lg md:text-xl font-light leading-relaxed bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800/60 backdrop-blur-md text-center md:text-left shadow-xl">
                Welcome to{" "}
                <span className="font-semibold text-science-teal">
                  Ludo&apos;s Molecular Graphics Lab
                </span>{" "}
                at the Scripps Research Institute.
                <br className="my-3 block" />
                We build the next generation of tools to model, simulate, and paint
                the molecular world – from{" "}
                <span className="font-medium text-science-teal">CellPack</span> to{" "}
                <span className="font-medium text-science-purple">Mesoscope</span>.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <a
              href="#software"
              className="inline-flex items-center gap-2 bg-science-teal/10 hover:bg-science-teal/20 text-science-teal border border-science-teal/60 px-8 py-3 rounded-full transition-all transform hover:scale-105 backdrop-blur-md group"
            >
              Explore Our Tools
              <svg
                className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
