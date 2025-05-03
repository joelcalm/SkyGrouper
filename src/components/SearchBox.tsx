import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface SearchBoxProps {
  activeTab: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ activeTab }) => {
  // This component is for visual purposes only
  // For the homepage, we'll just show flight search by default
  
  return (
    <div className="bg-white rounded-b-lg p-6 shadow-md">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="From where?"
              className="pl-10 w-full py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0770e3] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="To where?"
              className="pl-10 w-full py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0770e3] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Depart - Return"
              className="pl-10 w-full py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0770e3] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              className="w-full py-3 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#0770e3] focus:border-transparent"
            >
              <option>1 adult</option>
              <option>2 adults</option>
              <option>3 adults</option>
              <option>4 adults</option>
            </select>
          </div>
        </div>
        
        <button className="w-full bg-[#0770e3] hover:bg-[#0551a8] text-white font-bold py-3 px-4 rounded-md transition duration-200">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBox;