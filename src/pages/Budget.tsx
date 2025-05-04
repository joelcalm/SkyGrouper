// src/pages/Budget.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';
import { DollarSign, ArrowLeft } from 'lucide-react';

const INTERVALS = [
  { min: 100, max: 500 },
  { min: 500, max: 1000 },
  { min: 1000, max: 1500 },
  { min: 1500, max: 2000 },
  { min: 2000, max: 2500 },
];

const Budget: React.FC = () => {
  const navigate = useNavigate();
  const { groupTripId, userId, updateBudget, loading, userData } = useTripContext();

  const [minValue, setMinValue] = useState(500);
  const [maxValue, setMaxValue] = useState(1500);
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState('');

  // Pre-fill from context
  useEffect(() => {
    if (userData?.budget) {
      setMinValue(userData.budget.min);
      setMaxValue(userData.budget.max);
      setCurrency(userData.budget.currency || 'USD');
    }
  }, [userData]);

  // Redirect if context missing
  useEffect(() => {
    if (!groupTripId || !userId) {
      navigate('/');
    }
  }, [groupTripId, userId, navigate]);

  const handleIntervalSelect = (interval: { min: number; max: number }) => {
    setMinValue(interval.min);
    setMaxValue(interval.max);
    setError(''); // clear any existing error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minValue >= maxValue) {
      setError('Please select a valid interval');
      return;
    }
    try {
      await updateBudget(minValue, maxValue, currency);
      navigate('/waiting-room');
    } catch (err) {
      console.error('Error saving budget:', err);
      setError('Failed to save your budget preferences. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              What’s your budget?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your preferred price range for the entire trip
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Group Code Banner */}
            {groupTripId && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="flex justify-between text-blue-700">
                  <span>
                    Group Code: <strong>{groupTripId}</strong>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(groupTripId);
                      alert('Group code copied to clipboard');
                    }}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    Copy
                  </button>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-lg">
                {/* Price Range Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-3 bg-sky-50 rounded-full mr-3">
                        <DollarSign size={24} className="text-sky-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          Price range
                        </p>
                        <p className="text-gray-500 text-sm">
                          Per person for the whole trip
                        </p>
                      </div>
                    </div>
                    <div className="bg-sky-50 px-4 py-2 rounded-lg">
                      <span className="font-bold text-sky-800">
                        {currency} {minValue} – {maxValue}
                      </span>
                    </div>
                  </div>

                  {/* Interval Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {INTERVALS.map((intv) => {
                      const isActive =
                        intv.min === minValue && intv.max === maxValue;
                      return (
                        <button
                          key={`${intv.min}-${intv.max}`}
                          type="button"
                          onClick={() => handleIntervalSelect(intv)}
                          className={`px-4 py-3 border rounded-lg text-center font-medium transition
                            ${
                              isActive
                                ? 'bg-sky-100 border-sky-500 text-sky-700'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          ${intv.min} – ${intv.max}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Currency Selector */}
                <div className="mb-6">
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 mb-6 rounded-md">
                    <p>{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/theme-selection')}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {loading ? 'Saving...' : 'Complete'}
                    </span>
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

export default Budget;
