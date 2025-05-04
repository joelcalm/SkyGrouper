// src/components/Features.tsx
import React from 'react';
import { Users, MapPin, Calendar, Globe, ClipboardList, Heart } from 'lucide-react';

const FEATURE_LIST = [
  {
    icon: <Users className="h-6 w-6 text-sky-600" />, 
    title: 'Group Coordination',
    description:
      'Easily coordinate travel plans with friends and family without the hassle of multiple bookings.',
  },
  {
    icon: <MapPin className="h-6 w-6 text-sky-600" />, 
    title: 'Destination Discovery',
    description:
      "Find perfect destinations that match everyone's interests and preferences.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-sky-600" />, 
    title: 'Flexible Scheduling',
    description:
      'Find dates that work for everyone with our collaborative calendar system.',
  },
  {
    icon: <Globe className="h-6 w-6 text-sky-600" />, 
    title: 'Best Deals',
    description:
      'Get access to special group rates and discounts from hundreds of travel providers.',
  },
  {
    icon: <ClipboardList className="h-6 w-6 text-sky-600" />, 
    title: 'Itinerary Planner',
    description:
      'Build and share your trip itinerary in one collaborative document.',
  },
  {
    icon: <Heart className="h-6 w-6 text-sky-600" />, 
    title: 'Personalized Picks',
    description:
      'Receive personalized recommendations based on your group’s interests.',
  },
];

export const Features: React.FC = () => (
  <section className="relative py-20 bg-gradient-to-b from-white to-sky-50">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Why Plan Group Trips With Us
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {FEATURE_LIST.map(({ icon, title, description }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg border border-sky-100 p-8 text-center transform hover:-translate-y-2 transition"
          >
            <div className="inline-flex items-center justify-center p-4 bg-sky-50 rounded-full mb-4">
              {icon}
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;