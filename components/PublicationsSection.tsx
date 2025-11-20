
import React from 'react';
import { PUBLICATIONS } from '../constants';

const PublicationsSection: React.FC = () => {
  return (
    <section id="publications" className="py-20 bg-slate-800/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-10 border-l-4 border-science-purple pl-4">Selected Publications</h2>

        <div className="space-y-6">
          {PUBLICATIONS.map((pub) => (
            <div key={pub.id} className="group bg-slate-900/50 p-6 rounded-lg border border-slate-800 hover:border-science-teal/30 transition-all">
              <h3 className="text-lg font-semibold text-slate-200 group-hover:text-science-teal transition-colors mb-2">
                {pub.title}
              </h3>
              <p className="text-slate-400 text-sm mb-2 font-light">
                {pub.authors.join(', ')}
              </p>
              <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                <div className="text-xs text-slate-500 flex flex-wrap gap-2 items-center">
                    <span className="bg-slate-800 px-2 py-1 rounded font-semibold uppercase tracking-wider">
                        {pub.journal}
                    </span>
                    <span>{pub.year}</span>
                    {pub.volume && <span>• Vol {pub.volume}</span>}
                    {pub.pages && <span>• pp. {pub.pages}</span>}
                </div>
                
                {pub.link && (
                    <a href={pub.link} target="_blank" rel="noreferrer" className="text-science-purple hover:text-white text-sm font-medium flex items-center gap-1">
                        DOI
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicationsSection;
