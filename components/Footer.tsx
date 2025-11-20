
import React from 'react';
import { AFFILIATIONS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 relative z-10 border-t border-slate-800">
      {/* Affiliations Section */}
      <div className="py-10 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-80 hover:opacity-100 transition-all duration-500">
              {AFFILIATIONS.map((affil) => (
                  <a key={affil.id} href={affil.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                     {affil.logo && (
                        <div className="bg-white/90 p-2 rounded-md shadow-sm group-hover:bg-white transition-colors">
                          <img 
                             src={affil.logo} 
                             alt={affil.name} 
                             className="h-8 w-auto object-contain"
                             onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.style.display = 'none';
                             }}
                          />
                        </div>
                     )}
                     <div className="text-left">
                        <div className="text-slate-300 font-bold text-sm group-hover:text-science-teal transition-colors">{affil.name}</div>
                        <div className="text-slate-500 text-xs">{affil.role}</div>
                     </div>
                  </a>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-6 border-t border-slate-800/50 bg-black/20">
        <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
                <span className="font-display font-bold text-white tracking-widest">LUDO'S LAB</span>
            </div>
            <p className="text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} Molecular Visualization Research Group. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
