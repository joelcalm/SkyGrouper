// src/pages/DestinationSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';

const DestinationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    groupTripId,
    userId,
    updateDestinationIdeas,
    loading,
    userData,
  } = useTripContext();

  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  // Prefill on back-nav
  useEffect(() => {
    if (userData?.destinationIdeas?.length) {
      setDestination(userData.destinationIdeas[0]);
    }
  }, [userData]);

  // Kick to start if IDs missing
  useEffect(() => {
    if (!groupTripId || !userId) navigate('/');
  }, [groupTripId, userId, navigate]);

  // Mock autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setDestination(v);
    if (v.length > 1) {
      const mock = [
        'Barcelona – (BCN)',
        'London – (LHR)',
        'Paris – (CDG)',
        'New York – (JFK)',
        'Tokyo – (HND)',
      ];
      setSuggestions(
        mock.filter(m =>
          m.toLowerCase().includes(v.toLowerCase())
        )
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (s: string) => {
    setDestination(s);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError('Please choose a destination');
      return;
    }
    try {
      await updateDestinationIdeas(destination.trim());
      navigate('/date-selection');
    } catch {
      setError('Failed to save your destination. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Hero header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              What’s your destination?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell us where you’d like to fly.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Group code banner */}
            {groupTripId && (
              <div className="mb-6 p-4 bg-blue-50 border border-sky-100 rounded-2xl">
                <p className="text-sm text-blue-700 flex justify-between items-center">
                  <span>
                    Group Code: <strong>{groupTripId}</strong>
                  </span>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      navigator.clipboard.writeText(groupTripId);
                      alert('Group code copied!');
                    }}
                  >
                    Copy
                  </button>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-sky-100 rounded-2xl p-8 shadow-lg">
                {/* Input with icon */}
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Where are you flying to?
                </label>
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={handleInputChange}
                    onFocus={() => destination.length > 1 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="City or airport"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelect(s)}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/origin-selection')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-3 rounded-lg transition overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving…' : 'Next'}
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

export default DestinationSelectionPage;
