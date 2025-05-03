import React from 'react';
import { Users, Map, Calendar, Globe } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Plan Group Trips With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-6 w-6 text-[#0770e3]" />}
            title="Group Coordination"
            description="Easily coordinate travel plans with friends and family without the hassle of multiple bookings."
          />
          <FeatureCard
            icon={<Map className="h-6 w-6 text-[#0770e3]" />}
            title="Destination Discovery"
            description="Find perfect destinations that match everyone's interests and preferences."
          />
          <FeatureCard
            icon={<Calendar className="h-6 w-6 text-[#0770e3]" />}
            title="Flexible Scheduling"
            description="Find dates that work for everyone with our collaborative calendar system."
          />
          <FeatureCard
            icon={<Globe className="h-6 w-6 text-[#0770e3]" />}
            title="Best Deals"
            description="Get access to special group rates and discounts from hundreds of travel providers."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;