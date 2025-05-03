import React from 'react';

export const BackgroundDecoration: React.FC = () => {
  return (
    <>
      {/* Top right decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 md:w-72 md:h-72 bg-sky-500/20 rounded-full blur-3xl opacity-70" />
      
      {/* Bottom left decoration */}
      <div className="absolute -bottom-20 -left-20 w-60 h-60 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-70" />
      
      {/* Middle right decoration */}
      <div className="hidden md:block absolute top-1/3 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
      
      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gray-800"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>
    </>
  );
};