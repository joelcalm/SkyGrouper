import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';
import { 
  Palmtree, Mountain, Utensils, Building, Ticket, Martini,
  Compass, Camera, Tent, BookOpen
} from 'lucide-react';

// Reduced to 10 most relevant interests with icons
const INTERESTS = [
  { name: 'Beach', icon: <Palmtree size={24} /> },
  { name: 'Mountain', icon: <Mountain size={24} /> },
  { name: 'Food', icon: <Utensils size={24} /> },
  { name: 'Culture', icon: <Building size={24} /> },
  { name: 'Live Events', icon: <Ticket size={24} /> },
  { name: 'Nightlife', icon: <Martini size={24} /> },
  { name: 'Adventure', icon: <Compass size={24} /> },
  { name: 'Sightseeing', icon: <Camera size={24} /> },
  { name: 'Nature', icon: <Tent size={24} /> },
];

const ThemeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupTripId, userId, updateInterests, loading, userData } = useTripContext();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Pre-fill form if data exists
  useEffect(() => {
    if (userData?.interests && userData.interests.length > 0) {
      setSelectedInterests(userData.interests);
    }
  }, [userData]);

  // Redirect if no group or user ID
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');
    }
  }, [groupTripId, userId, navigate]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(item => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    
    try {
      await updateInterests(selectedInterests);
      navigate('/budget');
    } catch (err) {
      console.error('Error saving interests:', err);
      setError('Failed to save your interests. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <BackgroundDecoration />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">What are you looking for?</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the experiences that interest you most for this trip
            </p>
          </div>
          
          {groupTripId && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl max-w-md mx-auto">
              <p className="flex justify-between text-blue-700">
                <span>Group Code: <span className="font-bold">{groupTripId}</span></span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(groupTripId);
                    alert('Group code copied to clipboard');
                  }}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  Copy
                </button>
              </p>
            </div>
          )}
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select your interests</h2>
                <p className="text-gray-600 mb-6">Pick all that appeal to you. These will help us find the perfect destination.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {INTERESTS.map(interest => (
                    <div 
                      key={interest.name}
                      onClick={() => toggleInterest(interest.name)}
                      className={`
                        flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all
                        ${selectedInterests.includes(interest.name) 
                          ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                      `}
                    >
                      <div className={`
                        p-3 rounded-full mb-2
                        ${selectedInterests.includes(interest.name) ? 'bg-sky-100' : 'bg-gray-100'}
                      `}>
                        {interest.icon}
                      </div>
                      <span className="font-medium">{interest.name}</span>
                    </div>
                  ))}
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 mb-6 rounded-md">
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/date-selection')}
                    className="px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10">{loading ? "Saving..." : "Next"}</span>
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThemeSelectionPage;