import React, { ReactNode } from 'react';

interface TripCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  accentColor: 'sky' | 'emerald';
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const TripCard: React.FC<TripCardProps> = ({
  title,
  description,
  icon,
  accentColor,
  buttonText,
  onClick,
  disabled = false,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onInputChange,
  error,
}) => {
  const colorVariants = {
    sky: {
      card: 'border-sky-100 hover:shadow-sky-100/50',
      button: 'bg-sky-600 hover:bg-sky-700',
      ring: 'ring-sky-50',
      iconBg: 'bg-sky-50',
    },
    emerald: {
      card: 'border-emerald-100 hover:shadow-emerald-100/50',
      button: 'bg-emerald-600 hover:bg-emerald-700',
      ring: 'ring-emerald-50',
      iconBg: 'bg-emerald-50',
    },
  };

  return (
    <div className={`bg-white border ${colorVariants[accentColor].card} rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 flex flex-col`}>
      <div className="flex items-center mb-4">
        <div className={`p-3 ${colorVariants[accentColor].iconBg} rounded-full mr-3`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <p className="text-gray-600 mb-6">{description}</p>
      
      {inputLabel && (
        <div className="mb-4">
          <label htmlFor="groupCode" className="block text-sm font-medium text-gray-700 mb-2">
            {inputLabel}
          </label>
          <input
            type="text"
            id="groupCode"
            value={inputValue}
            onChange={onInputChange}
            placeholder={inputPlaceholder}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colorVariants[accentColor].ring} focus:border-transparent transition`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}
      
      <div className="mt-auto">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full ${colorVariants[accentColor].button} text-white py-4 px-6 rounded-lg font-medium transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-center relative overflow-hidden group`}
        >
          <span className="relative z-10">{buttonText}</span>
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>
    </div>
  );
};
