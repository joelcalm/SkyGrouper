import React from 'react';
import { Plane } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Plane className="text-[#0770e3] h-8 w-8 mr-2" />
      <span className="text-[#0770e3] font-bold text-2xl">skytravel</span>
    </div>
  );
};

export default Logo;