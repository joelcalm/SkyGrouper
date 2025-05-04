import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';

const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    groupTripId,
    userId,
    groupData,
    refreshGroupData,
    completeUserInput
  } = useTripContext();

  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Redirect & mark user complete
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');
      return;
    }

    if (!isCompleted) {
      completeUserInput()
        .then(() => setIsCompleted(true))
        .catch((err) => console.error('Error marking complete:', err));
    }
  }, [groupTripId, userId, navigate, completeUserInput, isCompleted]);

  // Poll for group updates every 5s
  useEffect(() => {
    refreshGroupData();
    const id = setInterval(refreshGroupData, 5000);
    return () => clearInterval(id);
  }, [refreshGroupData]);

  // Countdown timer for demo
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const completedCount = groupData?.users.filter(u => u.completed).length || 0;
  const totalCount = groupData?.numOfMembers || 0;

  const allDone = completedCount === totalCount;

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Waiting for Your Group
            </h1>
            <p className="text-lg text-gray-600">
              Share the code below and wait for everyone to finish.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Group Code */}
            {groupTripId && (
              <div className="mb-6 p-4 bg-sky-50 border border-sky-100 rounded-2xl text-center">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Group Code:</strong>
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-mono font-bold text-sky-700">
                    {groupTripId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(groupTripId);
                      alert('Copied to clipboard!');
                    }}
                    className="text-sky-600 hover:text-sky-800 focus:outline-none"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Completed:</span>
                <span className="font-medium">
                  {completedCount} / {totalCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-sky-600 h-3 rounded-full transition-width duration-500"
                  style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Members List */}
            <div className="mb-6 bg-white border border-sky-100 rounded-2xl shadow">
              <ul>
                {groupData?.users.map((user, idx) => {
                  const status = user.completed;
                  return (
                    <li
                      key={user.userId || idx}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800">User {idx + 1}</p>
                          {user.from && (
                            <p className="text-sm text-gray-500">from {user.from}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {status ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <Clock className="text-yellow-500" />
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {status ? 'Completed' : 'Waiting'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Waiting / Complete Section */}
            <div className="text-center">
              {allDone && timeLeft <= 0 ? (
                <>
                  <p className="text-green-600 font-medium mb-4">
                    All preferences collected! Ready to see results.
                  </p>
                  <button
                    onClick={() => navigate('/results')}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    View Results
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="animate-spin text-sky-600" size={48} />
                  <p className="text-gray-600">
                    Waiting... {allDone ? 'Finishing up' : timeLeft + 's'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaitingRoomPage;
