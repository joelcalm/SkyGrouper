// frontend_extracted/project/src/pages/DestinationSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';

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
  const [error, setError] = useState('');

  /* ------------------------------------------------------------------ */
  /*  Lifecycle helpers                                                 */
  /* ------------------------------------------------------------------ */

  // Pre-fill if the user is coming back - fix for userData.to vs destinationIdeas
  useEffect(() => {
    if (userData?.destinationIdeas && userData.destinationIdeas.length > 0) {
      setDestination(userData.destinationIdeas[0]);
    }
  }, [userData]);

  // Kick the user back to start if the essential IDs are missing
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');
    }
  }, [groupTripId, userId, navigate]);

  // Update document title
  useEffect(() => {
    document.title = 'Select Destination | SkyTravel';
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Autocomplete (mocked for now)                                     */
  /* ------------------------------------------------------------------ */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length > 1) {
      // In production you would query an airports API here
      const mock = [
        `${value.toUpperCase()} – Barcelona El Prat Airport`,
        `${value.toUpperCase()} – Rome Fiumicino Airport`,
        `${value.toUpperCase()} – Sydney Kingsford Smith Airport`,
        `${value.toUpperCase()} – Dubai International Airport`,
      ];
      setSuggestions(mock);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (choice: string) => {
    setDestination(choice);
    setSuggestions([]);
  };

  /* ------------------------------------------------------------------ */
  /*  Submit                                                            */
  /* ------------------------------------------------------------------ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination.trim()) {
      setError('Please choose a destination');
      return;
    }

    try {
      // Fix: Pass an array instead of a string to match the API function
      await updateDestinationIdeas(destination.trim());
      navigate('/date-selection');
    } catch (err) {
      console.error('Error saving destination:', err);
      setError('Failed to save your destination. Please try again.');
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">
          What’s your destination?
        </h1>

        {groupTripId && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Group Code:&nbsp;
              <span className="font-bold">{groupTripId}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* --- input -------------------------------------------------- */}
          <div className="mb-4 relative">
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Where are you flying to?
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={handleInputChange}
                placeholder="City or airport"
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* --- nav buttons ------------------------------------------- */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/origin-selection')}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DestinationSelectionPage;
