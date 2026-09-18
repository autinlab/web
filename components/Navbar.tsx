
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  onContactClick: () => void;
  onHistoryClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onContactClick, onHistoryClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[0]) => {
      e.preventDefault();
      
      if (item.label === 'History') {
          onHistoryClick();
          return;
      }

      const element = document.querySelector(item.href);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-science-dark/80 backdrop-blur-md border-b border-science-teal/20 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
           {/* Logo Fallback Handling */}
           <div className="w-10 h-10 bg-science-teal/20 rounded-lg flex items-center justify-center overflow-hidden relative">
             <img 
                src="assets/Logo1.gif" 
                alt="Molecular Graphics Lab Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    target.style.display = 'none';
                    if (parent) {
                        parent.innerText = 'MGL';
                        parent.classList.add('text-science-teal', 'font-display', 'font-bold', 'text-xs', 'tracking-tighter');
                    }
                }}
             />
           </div>
           <span className="font-display text-xl font-bold text-white tracking-wider">
            LUDO'S MGL
           </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className="text-slate-300 hover:text-science-teal transition-colors text-sm uppercase tracking-widest font-medium relative group cursor-pointer"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-science-teal transition-all group-hover:w-full"></span>
            </a>
          ))}
          
          <div className="h-6 w-px bg-slate-700 mx-2"></div>

          <a 
            href="https://www.scripps.edu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center bg-white/10 hover:bg-white/20 p-1.5 rounded-md transition-colors"
          >
             <img 
                src="assets/logo_scripps.png" 
                alt="Scripps Research" 
                className="h-6 w-auto invert brightness-0 grayscale contrast-200" 
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                }}
             />
          </a>

          <button
            onClick={onContactClick}
            className="px-5 py-2 rounded-full border border-science-purple text-science-purple hover:bg-science-purple hover:text-white transition-all text-sm uppercase tracking-widest font-medium"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
