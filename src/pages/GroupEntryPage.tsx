// frontend/project/src/pages/GroupEntryPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';

const GroupEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { createNewTrip, joinTrip, loading, error } = useTripContext();
  const [groupCode, setGroupCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const handleCreateGroup = async () => {
    try {
      await createNewTrip();
      navigate('/origin-selection');
    } catch (err) {
      console.error('Error creating group trip:', err);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      setJoinError('Please enter a group code');
      return;
    }

    try {
      await joinTrip(groupCode.trim());
      navigate('/origin-selection');
    } catch (err) {
      console.error('Error joining group trip:', err);
      setJoinError('Invalid group code or group not found');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Group Trip Planner</h1>
        
        <div className="mb-8">
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            {loading ? 'Creating...' : 'Create New Group Trip'}
          </button>
        </div>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or join existing group</span>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="groupCode" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Group Code
            </label>
            <input
              type="text"
              id="groupCode"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {joinError && <p className="text-red-500 text-sm mt-1">{joinError}</p>}
          </div>
          
          <button
            onClick={handleJoinGroup}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition duration-200"
          >
            {loading ? 'Joining...' : 'Join Group Trip'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GroupEntryPage;