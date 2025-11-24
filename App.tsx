
import React, { useState } from 'react';
import HexBackground from './components/HexBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResearchSection from './components/ResearchSection';
import SoftwareSection from './components/SoftwareSection';
import TeamSection from './components/TeamSection';
import PublicationsSection from './components/PublicationsSection';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import HistoryModal from './components/HistoryModal';
import ModelsModal from './components/ModelsModal';

const App: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModelsOpen, setIsModelsOpen] = useState(false);

  return (
    <div className="font-sans text-slate-200 antialiased min-h-screen flex flex-col">
      <HexBackground />
      <Navbar 
        onContactClick={() => setIsContactOpen(true)} 
        onHistoryClick={() => setIsHistoryOpen(true)}
      />
      
      <main className="flex-grow">
        <Hero />
        <ResearchSection onOpenModels={() => setIsModelsOpen(true)} />
        <SoftwareSection />
        <TeamSection />
        <PublicationsSection />
      </main>
      
      <Footer />
      
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
      
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <ModelsModal
        isOpen={isModelsOpen}
        onClose={() => setIsModelsOpen(false)}
      />
    </div>
  );
};

export default App;
