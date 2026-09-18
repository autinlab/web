
import React from 'react';
import { AFFILIATIONS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 relative z-10 border-t border-slate-800">
      {/* Affiliations Section */}
      <div className="py-16 bg-slate-900">
        <div className="container mx-auto px-6">
           <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center">
              {AFFILIATIONS.map((affil) => (
                  <a key={affil.id} href={affil.url} target="_blank" rel="noreferrer" className="flex items-center gap-5 group transition-transform hover:-translate-y-1 duration-300">
                     {affil.logo && (
                        <img 
                            src={affil.logo} 
                            alt={affil.name} 
                            className="h-16 w-auto object-contain brightness-0 invert opacity-70 group-hover:opacity-100 transition-all"
                            onError={(e) => {
                                const target = e.currentTarget;
                                const parent = target.parentElement;
                                target.style.display = 'none';
                                // Safely access parent style if parent exists
                                if (parent && parent.style) {
                                    parent.style.display = 'none';
                                }
                            }}
                        />
                     )}
                     <div className="text-left">
                        <div className="text-slate-100 font-display font-bold text-xl mb-1 group-hover:text-science-teal transition-colors">{affil.name}</div>
                        <div className="text-slate-400 text-base font-medium">{affil.role}</div>
                     </div>
                  </a>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-10 border-t border-slate-800 bg-black/40">
        <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
                <span className="font-display font-bold text-white text-lg tracking-widest">LUDO'S MOLECULAR GRAPHICS LAB</span>
            </div>
            <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Scripps Research. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
