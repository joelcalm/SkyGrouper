// src/components/Header.tsx
import React from 'react';
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      {/* Logo / Brand */}
      <Link to="/" className="flex items-center space-x-2">
        <Plane size={28} className="text-sky-600" />
        <span className="text-2xl font-bold text-gray-800">SkyGrouper</span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-4">
        {/* Currency Selector */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          defaultValue="USD"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>

        {/* Language Selector */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          defaultValue="en"
        >
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
        </select>

        {/* Auth Buttons */}
        <Link
          to="/login"
          className="text-gray-700 hover:text-gray-900 text-sm font-medium transition"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Sign up
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;