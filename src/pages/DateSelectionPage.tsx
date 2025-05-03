// frontend_extracted/project/src/pages/DateSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';

const DateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupTripId, userId, updateDates, loading, userData } = useTripContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  // Pre-fill form if data exists
  useEffect(() => {
    if (userData?.dates) {
      setStartDate(userData.dates.start || '');
      setEndDate(userData.dates.end || '');
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
    
    if (!startDate) {
      setError('Please select a start date');
      return;
    }
    
    if (!endDate) {
      setError('Please select an end date');
      return;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      setError('End date cannot be before start date');
      return;
    }
    
    try {
      await updateDates(startDate, endDate);
      navigate('/theme-selection');
    } catch (err) {
      console.error('Error saving dates:', err);
      setError('Failed to save your dates. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">When would you like to travel?</h1>
        
        {groupTripId && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Group Code: <span className="font-bold">{groupTripId}</span>
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mt-1 mb-4">{error}</p>}
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/destination-selection')}
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

export default DateSelectionPage;