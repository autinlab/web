
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[800px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 bg-black/30 hover:bg-slate-700 rounded-full text-white transition-colors"
          aria-label="Close Contact Modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Side: Contact Info */}
        <div className="p-8 md:w-5/12 flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 overflow-y-auto">
          
          {/* Header & Logo */}
          <div className="mb-10">
            <img 
                src="assets/logo_scripps.png" 
                alt="Scripps Research" 
                className="h-16 object-contain mb-6"
                onError={(e) => {
                    // Fallback if logo is missing
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    target.parentElement?.insertAdjacentHTML('afterbegin', '<div class="text-2xl font-bold text-white mb-4">Scripps Research</div>');
                }}
            />
            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-tight">
              Department of Integrative Structural and Computational Biology
            </h2>
            <div className="h-1 w-20 bg-science-teal rounded-full mt-4"></div>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
            
            {/* PI Contact */}
            <div>
              <div className="text-science-teal text-xs font-bold uppercase tracking-widest mb-2">Principal Investigator</div>
              <div className="text-lg font-bold text-white">Ludovic Autin, PhD</div>
              <a 
                href="mailto:autin@scripps.edu" 
                className="inline-flex items-center gap-2 text-slate-300 hover:text-science-purple transition-colors mt-1 group"
              >
                <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                autin@scripps.edu
              </a>
            </div>

            {/* Admin Contact Row */}
            <div className="pt-6 border-t border-slate-700/50">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Administrative Support</div>
              <div className="flex flex-col">
                <div className="text-lg font-semibold text-slate-200">Michelle Wilson</div>
                <a 
                    href="mailto:michelle@scripps.edu" 
                    className="text-slate-400 hover:text-white transition-colors mt-1 text-sm"
                >
                    michelle@scripps.edu
                </a>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <div className="mt-auto pt-8 text-xs text-slate-600">
             Ludo's Lab • Scripps Research • La Jolla, CA
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="md:w-7/12 bg-slate-800 relative min-h-[300px]">
          <div className="absolute inset-0 bg-slate-900 animate-pulse z-0"></div>
          <iframe
            title="Scripps Research Map"
            className="absolute inset-0 w-full h-full z-10 opacity-90 hover:opacity-100 transition-opacity"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=10550+N+Torrey+Pines+Rd,+La+Jolla,+CA+92037&output=embed"
            style={{ border: 0 }}
            allowFullScreen
          >
          </iframe>
          {/* Overlay Gradient for integration */}
          <div className="absolute pointer-events-none inset-0 shadow-[inset_10px_0_20px_rgba(15,23,42,0.8)] z-20 hidden md:block"></div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;
