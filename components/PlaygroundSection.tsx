import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PLAYGROUND_ITEMS } from '../constants';
import { PlaygroundItem } from '../types';
import PrintingGalleryModal from './PrintingGalleryModal';

const PlaygroundModal: React.FC<{ item: PlaygroundItem; onClose: () => void }> = ({ item, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200">
      <div className="w-full h-full max-w-7xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-4">
            <h3 className="text-xl md:text-2xl font-display font-bold text-white">{item.name}</h3>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-science-teal transition-colors text-sm flex items-center gap-1"
            >
              Open in New Tab
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-grow relative w-full bg-slate-950">
          {item.embedUrl ? (
            <iframe
              src={item.embedUrl}
              title={item.name}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; camera; microphone; xr-spatial-tracking"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              Preview not available for this experiment.
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const PlaygroundCard: React.FC<{
  item: PlaygroundItem;
  onPreview: (item: PlaygroundItem) => void;
  onOpenGallery?: () => void;
}> = ({ item, onPreview, onOpenGallery }) => {
  const hasGallery = !!onOpenGallery;
  const hasEmbed = !!item.embedUrl && !hasGallery;

  return (
    <div className="group flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-science-teal/50 transition-all shadow-lg hover:shadow-2xl hover:shadow-science-teal/10 h-full">
      <div className="relative w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl font-bold text-slate-700 group-hover:text-slate-600 transition-colors tracking-wider">
              {item.name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-60 pointer-events-none"></div>

        {item.tech && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-science-teal/20 text-science-teal border border-science-teal/30">
              {item.tech}
            </span>
          </div>
        )}

        {hasEmbed && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/60 backdrop-blur-[2px]">
            <button
              onClick={() => onPreview(item)}
              className="bg-science-teal hover:bg-science-teal/90 text-slate-900 font-bold py-2 px-6 rounded-full transform hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Launch Preview
            </button>
          </div>
        )}
        {hasGallery && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/60 backdrop-blur-[2px]">
            <button
              onClick={onOpenGallery}
              className="bg-science-teal hover:bg-science-teal/90 text-slate-900 font-bold py-2 px-6 rounded-full transform hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              View Gallery
            </button>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-display font-bold text-white">{item.name}</h3>
        </div>

        <p className="text-slate-400 mb-4 text-sm leading-relaxed">{item.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {item.features.map((feature, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-slate-900 text-slate-500 rounded border border-slate-700/50">
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-700/50 flex gap-3">
          {hasGallery ? (
            <button
              onClick={onOpenGallery}
              className="flex-grow inline-flex justify-center items-center gap-2 bg-slate-700 hover:bg-science-teal hover:text-slate-900 text-white py-3 rounded-xl transition-colors font-medium"
            >
              View Gallery
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
          ) : (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="flex-grow inline-flex justify-center items-center gap-2 bg-slate-700 hover:bg-science-teal hover:text-slate-900 text-white py-3 rounded-xl transition-colors font-medium"
          >
            Open Experiment
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          )}

          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-none w-12 flex justify-center items-center bg-slate-800 hover:bg-white hover:text-slate-900 text-slate-400 border border-slate-600 hover:border-white rounded-xl transition-colors"
              title="View Source on GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const PlaygroundSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<PlaygroundItem | null>(null);
  const [showPrintingGallery, setShowPrintingGallery] = useState(false);

  return (
    <section id="playground" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Playground</h2>
            <p className="text-slate-400">Experimental in-browser demos and works-in-progress. Launch a preview or open in a new tab.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {PLAYGROUND_ITEMS.map((item) => (
            <PlaygroundCard
              key={item.id}
              item={item}
              onPreview={setActiveItem}
              onOpenGallery={item.customModal === 'printing-gallery' ? () => setShowPrintingGallery(true) : undefined}
            />
          ))}
        </div>
      </div>

      {activeItem && (
        <PlaygroundModal item={activeItem} onClose={() => setActiveItem(null)} />
      )}

      {showPrintingGallery && (
        <PrintingGalleryModal onClose={() => setShowPrintingGallery(false)} />
      )}
    </section>
  );
};

export default PlaygroundSection;
