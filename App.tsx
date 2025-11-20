
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

const App: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="font-sans text-slate-200 antialiased min-h-screen flex flex-col">
      <HexBackground />
      <Navbar onContactClick={() => setIsContactOpen(true)} />
      
      <main className="flex-grow">
        <Hero />
        <ResearchSection />
        <SoftwareSection />
        <TeamSection />
        <PublicationsSection />
      </main>
      
      <Footer />
      
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
};

export default App;
