// src/pages/OriginSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';
import { ArrowLeft } from 'lucide-react';

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
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Where are you traveling from?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let us know your departure city so we can find the best options.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {groupTripId && (
              <div className="mb-6 p-4 bg-blue-50 border border-sky-100 rounded-2xl">
                <p className="text-sm text-blue-700 flex items-center justify-between">
                  <span>
                    Group Code: <span className="font-bold">{groupTripId}</span>
                  </span>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm"
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
              <div className="bg-white border border-sky-100 rounded-2xl p-8 shadow-lg transition duration-300">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
                  Your departure city
                </label>
                <input
                  type="text"
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Barcelona"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-4"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Next'}
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

export default OriginSelectionPage;
