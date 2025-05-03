import React, { useState } from 'react';
import { Plane, Hotel, Car, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center py-3 px-6 transition-colors ${
        isActive ? 'text-[#0770e3] border-b-2 border-[#0770e3]' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const SearchTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('flights');
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'group') {
      navigate('/group-entry');
    }
  };

  return (
    <div className="bg-white rounded-t-lg shadow-sm">
      <div className="flex overflow-x-auto">
        <Tab
          icon={<Plane size={20} />}
          label="Flights"
          isActive={activeTab === 'flights'}
          onClick={() => handleTabClick('flights')}
        />
        <Tab
          icon={<Hotel size={20} />}
          label="Hotels"
          isActive={activeTab === 'hotels'}
          onClick={() => handleTabClick('hotels')}
        />
        <Tab
          icon={<Car size={20} />}
          label="Car Rental"
          isActive={activeTab === 'cars'}
          onClick={() => handleTabClick('cars')}
        />
        <Tab
          icon={<Users size={20} />}
          label="Group Trip"
          isActive={activeTab === 'group'}
          onClick={() => handleTabClick('group')}
        />
      </div>
    </div>
  );
};

export default SearchTabs;