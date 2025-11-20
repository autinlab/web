import React from 'react';
import HexBackground from './components/HexBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResearchSection from './components/ResearchSection';
import SoftwareSection from './components/SoftwareSection';
import TeamSection from './components/TeamSection';
import PublicationsSection from './components/PublicationsSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="font-sans text-slate-200 antialiased min-h-screen flex flex-col">
      <HexBackground />
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <ResearchSection />
        <SoftwareSection />
        <TeamSection />
        <PublicationsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;