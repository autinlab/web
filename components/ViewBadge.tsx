import React from 'react';

export const EyeIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Glass pill with an eye icon and a pre-formatted view count (see formatCount in lib/playgroundStats).
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

export default ViewBadge;
