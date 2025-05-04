import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:7000';

/**
 * ---------------------------------------------------------------------
 * WaitingRoomPage
 * ---------------------------------------------------------------------
 *  • Shows real-time progress as each group member finishes their form
 *  • When everyone is done, the “View Results” button appears
 *  • Clicking the button calls /plan-trip with { groupTripId }
 *  • On success, navigates to /results and passes the server response
 * ---------------------------------------------------------------------
 */
const WaitingRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    groupTripId,
    userId,
    groupData,
    refreshGroupData,
    completeUserInput,
  } = useTripContext();

  const [loadingResults, setLoadingResults] = useState(false);
  const [markedComplete, setMarkedComplete]   = useState(false);

  /* ------------------------------------------------------------------ */
  /* 1️⃣  Redirect anonymous users & mark THIS user as “completed”       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');           // bounce home if context missing
      return;
    }
    if (!markedComplete) {
      completeUserInput()
        .then(() => setMarkedComplete(true))
        .catch((err) => console.error('Error marking complete:', err));
    }
  }, [groupTripId, userId, markedComplete, completeUserInput, navigate]);

  /* ------------------------------------------------------------------ */
  /* 2️⃣  Poll group status every 5 s so progress bar stays fresh        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    refreshGroupData();                  // immediate fetch
    const id = setInterval(refreshGroupData, 5_000);
    return () => clearInterval(id);
  }, [refreshGroupData]);

  /* ------------------------------------------------------------------ */
  /* 3️⃣  Derived state                                                  */
  /* ------------------------------------------------------------------ */
  const completedCount =
    groupData?.users.filter((u) => u.completed).length ?? 0;
  const totalCount = groupData?.numOfMembers ?? 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  /* ------------------------------------------------------------------ */
  /* 4️⃣  Fetch trip plan when user clicks “View Results”                */
  /* ------------------------------------------------------------------ */
  const handleViewResults = useCallback(async () => {
    if (!groupTripId) return;
    setLoadingResults(true);
    try {
      const res = await fetch(`${API_BASE}/plan-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupTripId }),      // 🔹 send the id
      });

      if (!res.ok)
        throw new Error(`Server responded ${res.status}`);

      const data = await res.json();
      navigate('/results', { state: { results: data } });
    } catch (err) {
      console.error('Error fetching results:', err);
      alert('Failed to get trip plan. Please try again.');
    } finally {
      setLoadingResults(false);
    }
  }, [groupTripId, navigate]);

  /* ------------------------------------------------------------------ */
  /* 5️⃣  Render                                                         */
  /* ------------------------------------------------------------------ */
  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Waiting for Your Group
            </h1>
            <p className="text-lg text-gray-600">
              Share the code below and wait for everyone to finish.
            </p>
          </header>

          <div className="max-w-md mx-auto">
            {/* Group Code */}
            {groupTripId && (
              <section className="mb-6 p-4 bg-sky-50 border border-sky-100 rounded-2xl text-center">
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  Group Code
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-mono font-bold text-sky-700">
                    {groupTripId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(groupTripId);
                      alert('Copied to clipboard!');
                    }}
                    className="text-sky-600 hover:text-sky-800 focus:outline-none"
                  >
                    Copy
                  </button>
                </div>
              </section>
            )}

            {/* Progress Bar */}
            <section className="mb-6">
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Completed:</span>
                <span className="font-medium">
                  {completedCount} / {totalCount}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-sky-600 h-3 rounded-full transition-width duration-500"
                  style={{
                    width: `${
                      totalCount ? (completedCount / totalCount) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </section>

            {/* Members List */}
            <section className="mb-6 bg-white border border-sky-100 rounded-2xl shadow">
              <ul>
                {groupData?.users.map((user, idx) => {
                  const done = user.completed;
                  return (
                    <li
                      key={user.userId || idx}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <User className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800">
                            User {idx + 1}
                          </p>
                          {user.from && (
                            <p className="text-sm text-gray-500">
                              from {user.from}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {done ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <Clock className="text-yellow-500" />
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md ${
                            done
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {done ? 'Completed' : 'Waiting'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Action area */}
            <section className="text-center">
              {allDone ? (
                loadingResults ? (
                  <Loader2 className="animate-spin text-sky-600" size={48} />
                ) : (
                  <>
                    <p className="text-green-600 font-medium mb-4">
                      All preferences collected! Ready to see results.
                    </p>
                    <button
                      type="button"
                      onClick={handleViewResults}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      View Results
                    </button>
                  </>
                )
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="animate-spin text-sky-600" size={48} />
                  <p className="text-gray-600">
                    Waiting for others to finish…
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaitingRoomPage;
