// src/pages/GroupEntryPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';
import { TripCard } from '../components/TripCard';
import { Users, UserPlus } from 'lucide-react';

const GroupEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { createNewTrip, joinTrip, loading, error } = useTripContext();
  const [groupCode, setGroupCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [numOfMembers, setNumOfMembers] = useState<number>(2);

  const handleCreateGroup = async () => {
    try {
      await createNewTrip(numOfMembers);
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
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <BackgroundDecoration />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Group Trip Planner</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your perfect trip together with friends and family, no matter where you're all traveling from
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Create Trip Card */}
            <div className="bg-white border border-sky-100 hover:shadow-sky-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-sky-50 rounded-full mr-3">
                  <Users size={24} className="text-sky-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create a new trip</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Start planning a new trip and invite others to join. You'll get a group code to share.
              </p>
              
              <div className="mb-4">
                <label htmlFor="numOfMembers" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of people in the trip
                </label>
                <select
                  id="numOfMembers"
                  value={numOfMembers}
                  onChange={(e) => setNumOfMembers(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-sky-50 focus:border-transparent transition"
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i} value={i + 2}>
                      {i + 2} {i + 2 === 1 ? 'person' : 'people'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 px-6 rounded-lg font-medium transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-center relative overflow-hidden group"
                >
                  <span className="relative z-10">{loading ? "Creating..." : "Create New Trip"}</span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>
            
            {/* Join Trip Card */}
            <TripCard 
              title="Join an existing trip"
              description="Enter the 6-digit group code shared with you to join a trip someone else created."
              icon={<UserPlus size={24} className="text-emerald-600" />}
              accentColor="emerald"
              buttonText={loading ? "Joining..." : "Join Group Trip"}
              onClick={handleJoinGroup}
              disabled={loading}
              inputLabel="Group Code"
              inputPlaceholder="Enter 6-digit code"
              inputValue={groupCode}
              onInputChange={(e) => setGroupCode(e.target.value)}
              error={joinError}
            />
          </div>
          
          {error && (
            <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 max-w-5xl mx-auto rounded-md shadow-sm">
              <p className="font-medium">There was an error</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GroupEntryPage;