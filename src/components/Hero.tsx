import React from 'react';
import SearchTabs from './SearchTabs';
import SearchBox from './SearchBox';

const Hero: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center h-[500px]" 
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative pt-16 pb-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Find Your Next</span>
              <span className="block">Adventure Together</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-white sm:text-xl md:mt-5 md:max-w-3xl">
              Compare flights, hotels, and car rentals from multiple providers in one place.
            </p>
          </div>
          
          <div className="mt-10 max-w-3xl mx-auto">
            <SearchTabs />
            <SearchBox activeTab="flights" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;