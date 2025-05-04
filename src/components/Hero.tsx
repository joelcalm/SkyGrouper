// src/components/Hero.tsx
import React from 'react';
import SearchTabs from './SearchTabs';
import SearchBox from './SearchBox';
import { BackgroundDecoration } from './BackgroundDecoration';

const Hero: React.FC = () => (
  <div className="relative min-h-screen overflow-hidden">
    <BackgroundDecoration />

    <div
      className="absolute inset-0 bg-cover bg-center min-h-screen w-full"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
    </div>

    <div className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-center z-10 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
        <span className="block">Find Your Next</span>
        <span className="block text-sky-300">Adventure Together</span>
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-sky-100 mb-10">
        Compare flights, hotels, and car rentals from multiple providers in one place.
      </p>

      <div className="mx-auto max-w-3xl w-full bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <SearchTabs />
        <SearchBox activeTab="flights" className="mt-4" />
      </div>
    </div>
  </div>
);

export default Hero;