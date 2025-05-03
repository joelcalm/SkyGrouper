// frontend_extracted/project/src/pages/ThemeSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';

const INTERESTS = [
  'Culture',
  'Sports',
  'Live Events',
  'Beach',
  'Mountain',
  'Nightlife',
  'Party',
  'Food',
  'Shopping',
  'Relaxation',
  'Adventure',
  'Nature',
  'History'
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
      navigate('/waiting-room');
    } catch (err) {
      console.error('Error saving interests:', err);
      setError('Failed to save your interests. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">What are you looking for?</h1>
        
        {groupTripId && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Group Code: <span className="font-bold">{groupTripId}</span>
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your interests (select all that apply)
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map(interest => (
                <div 
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`
                    p-3 border rounded-md cursor-pointer transition-colors
                    ${selectedInterests.includes(interest) 
                      ? 'bg-blue-100 border-blue-500 text-blue-700' 
                      : 'border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {interest}
                </div>
              ))}
            </div>
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/date-selection')}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ThemeSelectionPage;