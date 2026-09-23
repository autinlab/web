import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { PLAYGROUND_ITEMS } from '../constants';
import { PlaygroundItem } from '../types';
import { formatCount, usePlaygroundStats } from '../lib/playgroundStats';
import PrintingGalleryModal from './PrintingGalleryModal';
import StoryGalleryModal from './StoryGalleryModal';

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

        {item.notice && (
          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs md:text-sm">
            {item.notice}
          </div>
        )}

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

const EyeIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ViewBadge: React.FC<{ count: string }> = ({ count }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white/90 font-medium tabular-nums"
    style={{ background: 'rgba(20,20,22,.34)', backdropFilter: 'blur(10px) saturate(1.4)', WebkitBackdropFilter: 'blur(10px) saturate(1.4)', fontSize: '11.5px' }}
    title={`${count} views`}
  >
    <EyeIcon />
    {count}
  </span>
);

const canPlayLoops = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

// Muted loop over the poster: sources are attached the first time the card scrolls into view,
// it plays only while visible (or hovered) and the tab is shown, and fades in once frames are ready.
const LoopVideo: React.FC<{ loop: NonNullable<PlaygroundItem['loop']>; hovered: boolean }> = ({ loop, hovered }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setLoaded(true);
    }, { threshold: 0.35 });
    observer.observe(el);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !loaded) return;
    if ((inView || hovered) && tabVisible) {
      el.muted = true;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, hovered, tabVisible, loaded]);

  return (
    <video
      ref={ref}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={() => setReady(true)}
    >
      {loaded && loop.webm && <source src={loop.webm} type="video/webm" />}
      {loaded && <source src={loop.mp4} type="video/mp4" />}
    </video>
  );
};

const PlaygroundCard: React.FC<{
  item: PlaygroundItem;
  views: string | null;
  onPreview: (item: PlaygroundItem) => void;
  onOpenGallery?: () => void;
}> = ({ item, views, onPreview, onOpenGallery }) => {
  const hasGallery = !!onOpenGallery;
  const hasEmbed = !!item.embedUrl && !hasGallery;
  const [hovered, setHovered] = useState(false);
  const [showLoop] = useState(() => !!item.loop && canPlayLoops());

  return (
    <div className="group flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-science-teal/50 transition-all shadow-lg hover:shadow-2xl hover:shadow-science-teal/10 h-full">
      <div
        className="relative w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
        {showLoop && item.loop && <LoopVideo loop={item.loop} hovered={hovered} />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-60 pointer-events-none"></div>

        {item.tech && (
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-slate-900/70 text-science-teal border border-science-teal/40">
              {item.tech}
            </span>
          </div>
        )}

        {views && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <ViewBadge count={views} />
          </div>
        )}

        {hasEmbed && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/60 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => onPreview(item)}
                data-umami-event="launch-preview"
                data-umami-event-id={item.id}
                className="bg-science-teal hover:bg-science-teal/90 text-slate-900 font-bold py-2 px-6 rounded-full transform hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Launch Preview
              </button>

              {item.tutorialUrl && (
                <a
                  href={item.tutorialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800/90 hover:bg-white hover:text-slate-900 text-white font-bold py-2 px-6 rounded-full border border-slate-500 hover:border-white transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                  </svg>
                  Open Tutorial
                </a>
              )}
            </div>
          </div>
        )}
        {hasGallery && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/60 backdrop-blur-[2px]">
            <button
              onClick={onOpenGallery}
              data-umami-event="open-gallery"
              data-umami-event-id={item.id}
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

        {item.credit && (
          <p className="text-slate-500 mb-4 text-xs -mt-2">
            by{' '}
            <a
              href={item.credit.url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-science-teal transition-colors underline underline-offset-2"
            >
              {item.credit.label}
            </a>
          </p>
        )}

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
              data-umami-event="open-gallery"
              data-umami-event-id={item.id}
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
            data-umami-event="open-experiment"
            data-umami-event-id={item.id}
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
  const [showStoryGallery, setShowStoryGallery] = useState(false);
  const stats = usePlaygroundStats();
  const activeLabel = formatCount(stats?.active);
  const totalLabel = formatCount(stats?.total);

  return (
    <section id="playground" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Playground</h2>
            <p className="text-slate-400">Experimental in-browser demos and works-in-progress. Launch a preview or open in a new tab.</p>
          </div>
          {(activeLabel || totalLabel) && (
            <div className="flex items-center gap-4 text-sm text-slate-400 tabular-nums whitespace-nowrap">
              {activeLabel && (
                <span className="inline-flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:animate-none"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                  </span>
                  <span><span className="text-white font-medium">{activeLabel}</span> viewing</span>
                </span>
              )}
              {totalLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <EyeIcon />
                  <span><span className="text-white font-medium">{totalLabel}</span> views</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {PLAYGROUND_ITEMS.map((item) => (
            <PlaygroundCard
              key={item.id}
              item={item}
              views={formatCount(stats?.views[item.id])}
              onPreview={setActiveItem}
              onOpenGallery={
                item.customModal === 'printing-gallery' ? () => setShowPrintingGallery(true)
                : item.customModal === 'story-gallery' ? () => setShowStoryGallery(true)
                : undefined
              }
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

      {showStoryGallery && (
        <StoryGalleryModal onClose={() => setShowStoryGallery(false)} />
      )}
    </section>
  );
};

export default PlaygroundSection;
