import React from 'react';
import { RESEARCH_AREAS } from '../constants';

const ResearchSection: React.FC = () => {
  return (
    <section id="research" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Research Focus</h2>
            <div className="w-20 h-1 bg-science-teal mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RESEARCH_AREAS.map((area) => (
            <div 
              key={area.id}
              className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl hover:border-science-teal/50 transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] group backdrop-blur-sm"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{area.icon}</div>
              <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-science-teal transition-colors">
                {area.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;