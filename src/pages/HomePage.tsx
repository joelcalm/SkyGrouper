import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PopularDestinations from '../components/PopularDestinations';

const HomePage: React.FC = () => {
  // Set the title
  React.useEffect(() => {
    document.title = 'SkyTravel - Find Your Next Adventure';
  }, []);

  return (
    <div>
      <Hero />
      <Features />
      <PopularDestinations />
    </div>
  );
};

export default HomePage;