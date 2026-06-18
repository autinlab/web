import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { PRINTER_SECTIONS, PrintedModel, PrinterSection } from '../data/printing';

interface PrintingGalleryModalProps {
  onClose: () => void;
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

interface LightboxProps {
  models: PrintedModel[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ models, index, onClose, onNav }) => {
  const model = models[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav((index + 1) % models.length);
      if (e.key === 'ArrowLeft') onNav((index - 1 + models.length) % models.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, models.length, onClose, onNav]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Main image */}
      <div
        className="relative max-w-4xl max-h-[85vh] mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={model.imageUrl}
          alt={model.name}
          className="max-w-full max-h-[72vh] rounded-xl object-contain shadow-2xl"
        />
        {/* Caption */}
        <div className="mt-3 text-center">
          <p className="text-white font-semibold">{model.name}</p>
          {model.credit && <p className="text-science-teal text-sm">&#9733; {model.credit}</p>}
        </div>
      </div>

      {/* Prev */}
      {models.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav((index - 1 + models.length) % models.length); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next */}
      {models.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNav((index + 1) % models.length); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-400 text-sm">
        {index + 1} / {models.length}
      </div>
    </div>,
    document.body
  );
};

// ── Model card ────────────────────────────────────────────────────────────────

const ModelCard: React.FC<{ model: PrintedModel; onClick: () => void }> = ({ model, onClick }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasPhoto = !!model.imageUrl && !imgFailed;

  return (
    <div
      onClick={hasPhoto ? onClick : undefined}
      className={`flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 transition-all group ${hasPhoto ? 'cursor-zoom-in hover:border-science-teal/50 hover:shadow-lg hover:shadow-science-teal/10' : ''}`}
    >
      <div className="relative aspect-square bg-slate-900 overflow-hidden">
        {hasPhoto ? (
          <>
            <img
              src={model.imageUrl}
              alt={model.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgFailed(true)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs uppercase tracking-widest">Photo coming</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-semibold leading-tight mb-1">{model.name}</p>
        <p className="text-slate-400 text-xs leading-relaxed">{model.description}</p>
        {model.credit && (
          <p className="mt-2 text-science-teal text-xs">&#9733; {model.credit}</p>
        )}
      </div>
    </div>
  );
};

// ── Tab button ────────────────────────────────────────────────────────────────

const SectionTab: React.FC<{ section: PrinterSection; active: boolean; onClick: () => void }> = ({ section, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
      active
        ? 'bg-science-teal text-slate-900 border-science-teal shadow-[0_0_16px_rgba(45,212,191,0.3)]'
        : 'text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
    }`}
  >
    <span className={`w-2 h-2 rounded-full ${section.status === 'active' ? 'bg-green-400' : 'bg-slate-500'}`} />
    {section.printer} {section.model}
  </button>
);

// ── Main modal ────────────────────────────────────────────────────────────────

const PrintingGalleryModal: React.FC<PrintingGalleryModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(PRINTER_SECTIONS[0].id);
  const [lightbox, setLightbox] = useState<{ models: PrintedModel[]; index: number } | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !lightbox) onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, lightbox]);

  const section = PRINTER_SECTIONS.find(s => s.id === activeTab)!;

  const groups = section.models.reduce<Record<string, PrintedModel[]>>((acc, m) => {
    (acc[m.group] ??= []).push(m);
    return acc;
  }, {});

  // Flat list of all models with photos for lightbox navigation
  const allPhotos = section.models.filter(m => m.imageUrl);

  const openLightbox = useCallback((model: PrintedModel) => {
    const index = allPhotos.findIndex(m => m.id === model.id);
    if (index !== -1) setLightbox({ models: allPhotos, index });
  }, [allPhotos]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full h-full max-w-6xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-science-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-display font-bold text-white">3D Printing Lab</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Printer tabs */}
        <div className="flex gap-3 px-5 pt-4 shrink-0">
          {PRINTER_SECTIONS.map(s => (
            <SectionTab key={s.id} section={s} active={activeTab === s.id} onClick={() => setActiveTab(s.id)} />
          ))}
        </div>

        {/* Printer tagline + optional printer photo */}
        <div className="px-5 pt-3 pb-1 shrink-0 flex items-center gap-4">
          {section.printerImageUrl && (
            <img
              src={section.printerImageUrl}
              alt={`${section.printer} ${section.model}`}
              className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
            />
          )}
          <p className="text-slate-400 text-sm">{section.tagline}</p>
        </div>

        {/* Gallery */}
        <div className="flex-grow overflow-y-auto px-5 pb-6 space-y-8 mt-2">
          {Object.entries(groups).map(([groupName, models]) => (
            <div key={groupName}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-800 pb-2">
                {groupName}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {models.map(m => (
                  <ModelCard key={m.id} model={m} onClick={() => openLightbox(m)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox
          models={lightbox.models}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(lb => lb ? { ...lb, index: i } : null)}
        />
      )}
    </div>,
    document.body
  );
};

export default PrintingGalleryModal;
