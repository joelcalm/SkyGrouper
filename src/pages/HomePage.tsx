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
      {/* Hero with no top spacing */}
      <div className="relative">
        <Hero />
      </div>

      {/* Rest of content */}
      <div className="relative bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="space-y-24">
            <Features />
            <PopularDestinations />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
