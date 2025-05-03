import React from 'react';
import { Plane, Hotel, Car, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Link to="/" className="mb-4 sm:mb-0">
            <Logo />
          </Link>
          
          <nav className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
              USD
            </button>
            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
              English
            </button>
            <button className="bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded">
              Log in
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;