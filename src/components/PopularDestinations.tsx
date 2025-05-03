import React from 'react';

interface DestinationCardProps {
  city: string;
  country: string;
  image: string;
  price: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ city, country, image, price }) => {
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-[1.02]">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold">{city}</h3>
        <p className="text-sm text-gray-200">{country}</p>
        <p className="mt-2 text-sm font-semibold">From <span className="text-lg">{price}</span></p>
      </div>
    </div>
  );
};

const PopularDestinations: React.FC = () => {
  const destinations = [
    { city: 'Barcelona', country: 'Spain', image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg', price: '$120' },
    { city: 'New York', country: 'United States', image: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg', price: '$240' },
    { city: 'Tokyo', country: 'Japan', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', price: '$350' },
    { city: 'Paris', country: 'France', image: 'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg', price: '$180' },
    { city: 'Rome', country: 'Italy', image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg', price: '$150' },
    { city: 'London', country: 'United Kingdom', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', price: '$190' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard
              key={index}
              city={destination.city}
              country={destination.country}
              image={destination.image}
              price={destination.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;