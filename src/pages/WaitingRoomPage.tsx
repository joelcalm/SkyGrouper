// frontend_extracted/project/src/pages/WaitingRoomPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';

const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    groupTripId, 
    userId, 
    groupData, 
    refreshGroupData, 
    completeUserInput, 
    loading 
  } = useTripContext();
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Redirect if no group or user ID
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');
      return;
    }

    // Mark the user as completed
    const markComplete = async () => {
      if (!isCompleted) {
        try {
          await completeUserInput();
          setIsCompleted(true);
        } catch (err) {
          console.error('Error marking user as complete:', err);
        }
      }
    };
    
    markComplete();
  }, [groupTripId, userId, navigate, completeUserInput, isCompleted]);

  // Set up polling for group data
  useEffect(() => {
    // Initial load
    refreshGroupData();
    
    // Set up polling
    const intervalId = setInterval(() => {
      refreshGroupData();
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshGroupData]);

  // Countdown timer for demo purposes
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Count completed members
  const completedCount = groupData?.users.filter(user => user.completed).length || 0;
  const totalCount = groupData?.users.length || 0;

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Waiting for Group Members</h1>
        
        {groupTripId && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md">
            <p className="text-center">
              <span className="block font-medium mb-2">Share this code with your friends</span>
              <span className="text-2xl font-bold text-blue-700">{groupTripId}</span>
            </p>
            <button 
              className="mt-2 w-full py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(groupTripId);
                alert('Group code copied to clipboard');
              }}
            >
              Copy Code
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Group members completed:</span>
            <span className="font-medium">{completedCount} / {totalCount}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(completedCount / Math.max(totalCount, 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {groupData && groupData.users.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Group Members</h2>
            <ul className="divide-y divide-gray-200">
              {groupData.users.map((user, index) => (
                <li key={user.userId || index} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium">User {index + 1}</span>
                    {user.from && <span className="text-gray-500 ml-2">from {user.from}</span>}
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    user.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.completed ? 'Completed' : 'In Progress'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Waiting for everyone to complete their preferences...
          </p>
          
          {/* For demo purposes - in a real app, you'd calculate matches once everyone is done */}
          {timeLeft <= 0 ? (
            <div>
              <p className="text-green-600 font-medium mb-4">
                All preferences collected! Calculating best destinations for your group.
              </p>
              <button
                onClick={() => navigate('/results')}
                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                View Results
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Demo mode: Results will be available in {timeLeft} seconds
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WaitingRoomPage;