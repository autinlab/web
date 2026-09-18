
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { INTEGRATIVE_MODELS } from '../constants';

interface ModelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelsModal: React.FC<ModelsModalProps> = ({ isOpen, onClose }) => {
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setActiveModelId(null); // Reset active model on close
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-7xl bg-slate-950 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900">
             <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Integrative Models Gallery</h2>
                <p className="text-slate-400 text-sm mt-1">Explore our collection of structural models.</p>
             </div>
             
             {/* Close Button */}
            <button 
                onClick={onClose} 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors border border-slate-600"
                aria-label="Close Gallery"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto p-6 md:p-8 bg-slate-950">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INTEGRATIVE_MODELS.map((model) => (
                    <div 
                        key={model.id} 
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-science-teal/50 transition-all shadow-lg flex flex-col h-[400px]"
                    >
                        {/* Interactive Area */}
                        <div className="relative flex-grow bg-slate-800 w-full overflow-hidden">
                            {activeModelId === model.id ? (
                                <iframe 
                                    src={model.viewerUrl} 
                                    className="w-full h-full border-0 animate-in fade-in duration-500"
                                    title={model.name}
                                />
                            ) : (
                                <div className="w-full h-full relative group">
                                     {/* Render Image or Placeholder */}
                                     {model.imageUrl ? (
                                        <div className="w-full h-full relative">
                                            <img 
                                                src={model.imageUrl} 
                                                alt={model.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    target.style.display = 'none';
                                                    target.parentElement?.classList.add('bg-slate-800');
                                                    // Fallback to placeholder if image fails
                                                    const placeholder = document.createElement('div');
                                                    placeholder.className = 'absolute inset-0 flex items-center justify-center';
                                                    placeholder.innerHTML = '<div class="text-6xl opacity-30 select-none grayscale">🧬</div>';
                                                    target.parentElement?.appendChild(placeholder);
                                                }}
                                            />
                                            {/* Gradient overlay to make text readable/merge nicely */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                                        </div>
                                     ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-science-teal via-slate-900 to-slate-900"></div>
                                            <div className="text-6xl opacity-30 select-none grayscale group-hover:grayscale-0 transition-all duration-500">🧬</div>
                                        </div>
                                     )}
                                     
                                     {/* Overlay Button */}
                                     <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <button 
                                            onClick={() => setActiveModelId(model.id)}
                                            className="bg-science-teal text-slate-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            </svg>
                                            Interact in 3D
                                        </button>
                                     </div>
                                </div>
                            )}
                        </div>

                        {/* Info Area */}
                        <div className="p-5 border-t border-slate-800 bg-slate-900 z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-display font-bold text-white text-lg leading-tight">{model.name}</h3>
                                {model.year && (
                                    <span className="text-xs font-mono text-science-teal bg-science-teal/10 px-2 py-0.5 rounded border border-science-teal/20">
                                        {model.year}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                {model.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModelsModal;
