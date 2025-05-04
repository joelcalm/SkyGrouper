// src/pages/DateSelectionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useTripContext } from '../TripContext';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';

// Date range picker imports
import { DateRange } from 'react-date-range';
import { addDays, format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupTripId, userId, updateDates, loading, userData } = useTripContext();

  // Set default date range
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection',
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState('');

  // Prefill date if data exists
  useEffect(() => {
    if (userData?.dates?.start && userData?.dates?.end) {
      setRange({
        startDate: new Date(userData.dates.start),
        endDate: new Date(userData.dates.end),
        key: 'selection',
      });
    }
  }, [userData]);

  // Redirect if no IDs
  useEffect(() => {
    if (!groupTripId || !userId) navigate('/');
  }, [groupTripId, userId, navigate]);

  const handleDateChange = (item: any) => {
    setRange(item.selection);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range.startDate || !range.endDate) {
      setError('Please select both dates');
      return;
    }
    if (range.endDate < range.startDate) {
      setError('End date cannot be before start');
      return;
    }
    try {
      await updateDates(
        format(range.startDate, 'yyyy-MM-dd'),
        format(range.endDate, 'yyyy-MM-dd')
      );
      navigate('/theme-selection');
    } catch {
      setError('Failed to save your dates. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Hero */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              When would you like to travel?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pick your trip dates in one go.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {/* Group code */}
            {groupTripId && (
              <div className="mb-6 p-4 bg-blue-50 border border-sky-100 rounded-2xl">
                <p className="flex justify-between text-sm text-blue-700">
                  <span>
                    Group Code: <strong>{groupTripId}</strong>
                  </span>
                  <button
                    className="text-blue-600 hover:text-blue-800"
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
              <div className="bg-white border border-sky-100 rounded-2xl p-6 shadow-lg">
                <div className="mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-sky-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      Travel Dates
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="mt-2 w-full p-3 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:border-sky-500 transition"
                  >
                    <span>
                      {format(range.startDate, 'MMM dd, yyyy')} - {format(range.endDate, 'MMM dd, yyyy')}
                    </span>
                    <span className="text-gray-400">{showCalendar ? '▲' : '▼'}</span>
                  </button>

                  {showCalendar && (
                    <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                      <DateRange
                        ranges={[range]}
                        onChange={handleDateChange}
                        moveRangeOnFirstSelection={false}
                        minDate={new Date()}
                        rangeColors={['#0284c7']}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm mt-3 mb-3">{error}</p>}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/destination-selection')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back
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

export default DateSelectionPage;
