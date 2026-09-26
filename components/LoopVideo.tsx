import React, { useState, useEffect, useRef } from 'react';
import { VideoLoop } from '../types';

export const canPlayLoops = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

// Muted loop over the poster: sources are attached the first time the card scrolls into view,
// it plays only while visible (or hovered) and the tab is shown, and fades in once frames are ready.
const LoopVideo: React.FC<{ loop: VideoLoop; hovered: boolean }> = ({ loop, hovered }) => {
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

export default LoopVideo;
