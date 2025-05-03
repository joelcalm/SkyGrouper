import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Mobile App</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Discover</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">How We Work</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Help/FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Affiliates</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Partners</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">More</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Airline Fees</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Airlines</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Terms of Use</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Travel Guides</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Travel Stories</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Travel Tips</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#0770e3]">Travel Hacks</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Logo />
            <p className="text-gray-600 text-sm mt-4 md:mt-0">
              © {new Date().getFullYear()} SkyTravel Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;