// frontend_extracted/project/src/pages/OriginSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';

const OriginSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupTripId, userId, updateOrigin, loading, userData } = useTripContext();
  const [origin, setOrigin] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form if data exists
  useEffect(() => {
    if (userData?.from) {
      setOrigin(userData.from);
    }
  }, [userData]);

  // Redirect if no group or user ID
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');
    }
  }, [groupTripId, userId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin.trim()) {
      setError('Please enter your departure city');
      return;
    }
    
    try {
      await updateOrigin(origin);
      navigate('/destination-selection');
    } catch (err) {
      console.error('Error saving origin:', err);
      setError('Failed to save your origin. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Where are you traveling from?</h1>
        
        {groupTripId && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Group Code: <span className="font-bold">{groupTripId}</span>
              <button 
                className="ml-2 text-blue-600 hover:text-blue-800"
                onClick={() => {
                  navigator.clipboard.writeText(groupTripId);
                  alert('Group code copied to clipboard');
                }}
              >
                Copy
              </button>
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              Your departure city
            </label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Barcelona"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
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

export default OriginSelectionPage;