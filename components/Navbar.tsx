
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  onContactClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const element = document.querySelector(href);
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
                alt="Ludo's Lab Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    target.style.display = 'none';
                    if (parent) {
                        parent.innerText = 'LL';
                        parent.classList.add('text-science-teal', 'font-display', 'font-bold');
                    }
                }}
             />
           </div>
           <span className="font-display text-xl font-bold text-white tracking-wider">
            LUDO'S LAB
           </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-slate-300 hover:text-science-teal transition-colors text-sm uppercase tracking-widest font-medium relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-science-teal transition-all group-hover:w-full"></span>
            </a>
          ))}
          
          <button
            onClick={onContactClick}
            className="px-5 py-2 rounded-full border border-science-purple text-science-purple hover:bg-science-purple hover:text-white transition-all text-sm uppercase tracking-widest font-medium ml-4"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
