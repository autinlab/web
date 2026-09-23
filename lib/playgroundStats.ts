import { useEffect, useState } from 'react';
import { PLAYGROUND_STATS_URL } from '../constants';

export interface PlaygroundStats {
  active?: number;
  total?: number;
  views: Record<string, number>;
}

const POLL_MS = 60_000;

// Fetches the Umami stats feed on load and every minute while the tab is visible.
// Any failure leaves the stats null so every badge stays hidden.
export function usePlaygroundStats(): PlaygroundStats | null {
  const [stats, setStats] = useState<PlaygroundStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (document.hidden) return;
      fetch(PLAYGROUND_STATS_URL, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data) => {
          if (cancelled || !data || typeof data !== 'object') return;
          setStats({
            active: typeof data.active === 'number' ? data.active : undefined,
            total: typeof data.total === 'number' ? data.total : undefined,
            views: data.views && typeof data.views === 'object' ? data.views : {},
          });
        })
        .catch(() => {});
    };
    load();
    const timer = window.setInterval(load, POLL_MS);
    document.addEventListener('visibilitychange', load);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', load);
    };
  }, []);

  return stats;
}

// 812 / 1.2k / 3.4M; returns null for missing or non-positive counts so callers hide the badge.
export function formatCount(n: number | undefined): string | null {
  if (typeof n !== 'number' || !isFinite(n) || n <= 0) return null;
  if (n < 1000) return String(Math.round(n));
  if (n < 999_500) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0).replace(/\.0$/, '')}M`;
}
