import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { LAB_STORIES, LabStory } from '../data/stories';

interface StoryGalleryModalProps {
  onClose: () => void;
}

// ── Story card ────────────────────────────────────────────────────────────────

const StoryCard: React.FC<{ story: LabStory }> = ({ story }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = !!story.imageUrl && !imgFailed;

  return (
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-science-teal/50 hover:shadow-lg hover:shadow-science-teal/10 transition-all"
    >
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {hasImage ? (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-science-teal/20 to-science-purple/20 text-slate-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        {/* Play affordance */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-science-teal/90 text-slate-900 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-lg">
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>

        {story.scenes !== undefined && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 text-xs font-medium backdrop-blur-sm">
            {story.scenes} scenes
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <p className="text-white font-semibold leading-tight mb-1 group-hover:text-science-teal transition-colors">{story.title}</p>
        {story.credit && <p className="text-science-teal text-xs mb-2">&#9733; {story.credit}</p>}
        <p className="text-slate-400 text-xs leading-relaxed">{story.description}</p>
        <span className="mt-3 text-slate-500 group-hover:text-science-teal text-xs font-medium uppercase tracking-wider transition-colors">
          Open story &#8599;
        </span>
      </div>
    </a>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────

const StoryGalleryModal: React.FC<StoryGalleryModalProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-display font-bold text-white">Molecular Stories</h3>
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

        {/* Intro */}
        <p className="px-5 pt-4 pb-1 text-slate-400 text-sm shrink-0">
          Guided, scene-by-scene tours of molecular structures authored by the lab with{' '}
          <a href="https://molstar.org/mol-view-stories/" target="_blank" rel="noopener noreferrer" className="text-science-teal hover:underline">
            MolViewStories
          </a>
          . Each story opens in the Mol* story viewer in a new tab.
        </p>

        {/* Grid */}
        <div className="flex-grow overflow-y-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LAB_STORIES.filter(s => !s.unlisted).map(s => <StoryCard key={s.id} story={s} />)}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StoryGalleryModal;
