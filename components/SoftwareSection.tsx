import React, { useState } from 'react';
import { SOFTWARE_TOOLS } from '../constants';
import { SoftwareType, Software } from '../types';

const SoftwareCard: React.FC<{ tool: Software }> = ({ tool }) => {
  const [isLive, setIsLive] = useState(false);
  const hasEmbed = !!tool.embedUrl;

  return (
    <div className="group flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-science-purple/50 transition-all shadow-lg hover:shadow-2xl hover:shadow-science-purple/10 h-full">
      <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
        {isLive && hasEmbed ? (
          <div className="w-full h-full relative">
             <iframe
                src={tool.embedUrl}
                title={tool.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
          </div>
        ) : (
          <>
            <img
              src={tool.imageUrl}
              alt={tool.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement?.classList.add('bg-gradient-to-br', 'from-slate-800', 'to-slate-900');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-60 pointer-events-none"></div>
            
            {/* Type Badge */}
            <div className="absolute top-4 right-4 pointer-events-none">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                  tool.type === SoftwareType.WEB_APP ? 'bg-science-teal/20 text-science-teal border border-science-teal/30' :
                  tool.type === SoftwareType.LIBRARY ? 'bg-science-purple/20 text-science-purple border border-science-purple/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                  {tool.type}
              </span>
            </div>

            {/* Overlay for Web Apps */}
            {hasEmbed && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/60 backdrop-blur-[2px]">
                    <button 
                        onClick={() => setIsLive(true)}
                        className="bg-science-teal hover:bg-science-teal/90 text-slate-900 font-bold py-2 px-6 rounded-full transform hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Preview App
                    </button>
                </div>
            )}
          </>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-display font-bold text-white">{tool.name}</h3>
             {isLive && (
                <button 
                    onClick={() => setIsLive(false)}
                    className="text-slate-500 hover:text-red-400 text-xs uppercase font-bold tracking-wider flex items-center gap-1"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Close
                </button>
             )}
        </div>
        
        <p className="text-slate-400 mb-4 text-sm leading-relaxed">{tool.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
            {tool.features.map((feature, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-slate-900 text-slate-500 rounded border border-slate-700/50">
                    {feature}
                </span>
            ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700/50">
            <a 
            href={tool.url}
            target="_blank" 
            rel="noreferrer"
            className="inline-flex w-full justify-center items-center gap-2 bg-slate-700 hover:bg-science-purple text-white py-3 rounded-xl transition-colors font-medium"
            >
            {isLive ? 'Open in New Tab' : (tool.type === SoftwareType.LIBRARY ? 'View Repository' : 'Launch Tool')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
        </div>
      </div>
    </div>
  );
};

const SoftwareSection: React.FC = () => {
  return (
    <section id="software" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-800 pb-6">
            <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Our Software</h2>
                <p className="text-slate-400">Open-source tools for the scientific community.</p>
            </div>
            <a href="https://github.com/autinlab" target="_blank" rel="noreferrer" className="hidden md:flex text-science-purple hover:text-white transition-colors items-center gap-2 mt-4 md:mt-0">
                View GitHub
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {SOFTWARE_TOOLS.map((tool) => (
            <SoftwareCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwareSection;