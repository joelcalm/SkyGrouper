// src/pages/HomePage.tsx
import React from 'react';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';

import Hero from '../components/Hero';
import Features from '../components/Features';
import PopularDestinations from '../components/PopularDestinations';

const HomePage: React.FC = () => {
  /* ---------- document title ---------- */
  React.useEffect(() => {
    document.title = 'SkyTravel - Find Your Next Adventure';
  }, []);

  /* ---------- UI ---------- */
  return (
    <Layout>
      {/* --- identical wrapper / gradient / decoration as GroupEntryPage --- */}
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <BackgroundDecoration />

        {/* --- main content container --- */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* keep spacing consistent with other cards/sections */}
          <div className="space-y-24">
            <Hero />
            <Features />
            <PopularDestinations />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
