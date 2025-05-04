import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { Heart, X, MapPin, Info, DollarSign, ThumbsUp, ThumbsDown, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header'; // Assuming you have these components
import Footer from '../components/Footer'; // Assuming you have these components
import Button from '../components/Button'; // Assuming you have this component
import { useTripContext } from '../TripContext'; // Import context if needed for groupTripId or other actions

// --- Interfaces for API Response ---
interface ApiDestinationDetails {
  city: string;
  country: string;
  summary: string;
  top_highlights: string[];
}

interface ApiFlightDetails {
  // We might not need all flight details for the card, focusing on totals
}

interface ApiPlan {
  destination: ApiDestinationDetails;
  flights: ApiFlightDetails[]; // Keep structure, even if unused in card directly
  totals: {
    total_flight_cost: number;
  };
}

interface ApiResponse {
  plans: ApiPlan[];
  shortlist?: any[]; // Keep if needed later, but not used for basic card
}

// --- Interface for UI Card Data ---
interface UIDestination {
  id: string; // Use city-country as a unique ID
  name: string;
  country: string;
  image: string; // URL for the image
  description: string;
  highlights: string[]; // Renamed from interests
  priceIndicator: string; // e.g., '€', '€€', '€€€'
  totalFlightCost: number;
  likes: number;
  dislikes: number;
}

// Placeholder images (replace with real ones or an API solution)
const placeholderImages = [
  'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg', // Barcelona
  'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg', // Rome
  'https://images.pexels.com/photos/967292/pexels-photo-967292.jpeg', // Amsterdam
  'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg', // Berlin
  'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg', // Lisbon
];

// Helper to get a price indicator
const getPriceIndicator = (cost: number): string => {
  if (cost <= 0) return '?'; // Handle zero/missing cost
  if (cost < 300) return '€';
  if (cost < 700) return '€€';
  return '€€€';
};


const ChooseDestinationPage: React.FC = () => {
  // Assuming groupTripId is passed as a URL parameter named 'groupTripId'
  // Adjust if your route parameter has a different name (e.g., 'groupCode')
  const { groupTripId } = useParams<{ groupTripId: string }>();
  const navigate = useNavigate();
  // const { userId } = useTripContext(); // Get userId if needed for voting API call

  const [destinations, setDestinations] = useState<UIDestination[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'right' | 'left' | null>(null);
  const [votingComplete, setVotingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingVotes, setRemainingVotes] = useState(0);

  // --- Fetch Destinations from API ---
  const fetchDestinations = useCallback(async () => {
    if (!groupTripId) {
      setError("Group ID is missing.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching plans for group: ${groupTripId}`);
      const response = await fetch('http://127.0.0.1:6000/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: groupTripId }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`Failed to fetch trip plans: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      console.log("API Response Data:", data);

      if (!data.plans || data.plans.length === 0) {
        setError("No destination plans found for this group.");
        setDestinations([]);
        setRemainingVotes(0);
      } else {
        // Map API data to UI data
        const uiDestinations: UIDestination[] = data.plans.map((plan, index) => ({
          id: `${plan.destination.city}-${plan.destination.country}`,
          name: plan.destination.city,
          country: plan.destination.country,
          image: placeholderImages[index % placeholderImages.length],
          description: plan.destination.summary,
          highlights: plan.destination.top_highlights || [],
          priceIndicator: getPriceIndicator(plan.totals.total_flight_cost),
          totalFlightCost: plan.totals.total_flight_cost,
          likes: 0,
          dislikes: 0,
        }));

        setDestinations(uiDestinations);
        setRemainingVotes(uiDestinations.length);
      }
    } catch (err: any) {
      console.error("Error fetching destinations:", err);
      setError(err.message || 'An unexpected error occurred while fetching destinations.');
    } finally {
      setIsLoading(false);
    }
  }, [groupTripId]); // Dependency array includes groupTripId

  // Load destinations on component mount
  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]); // Use the memoized fetch function

  // --- Handle Voting Logic ---
  const handleVote = (liked: boolean) => {
    if (currentIndex >= destinations.length || votingComplete) return;

    const destinationId = destinations[currentIndex].id;
    console.log(`Voting ${liked ? 'Like' : 'Dislike'} on: ${destinationId}`);

    // Optimistic UI update
    const newDestinations = [...destinations];
    if (liked) {
      newDestinations[currentIndex].likes += 1;
      setDirection('right');
    } else {
      newDestinations[currentIndex].dislikes += 1;
      setDirection('left');
    }
    setDestinations(newDestinations);
    setRemainingVotes(prev => Math.max(0, prev - 1)); // Decrement remaining votes

    // TODO: Send vote to backend API
    // Example structure (adjust endpoint and payload as needed):
    /*
    fetch('/api/group-trip/vote', { // Replace with your actual voting endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            groupTripId: groupTripId,
            userId: userId, // Make sure userId is available from context
            destinationId: destinationId,
            vote: liked ? 'like' : 'dislike'
        })
    })
    .then(res => { if (!res.ok) throw new Error('Vote submission failed'); })
    .catch(err => {
        console.error("Failed to submit vote:", err);
        // Handle error - maybe revert optimistic update or show message
    });
    */

    // Move to next card after animation delay
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setDirection(null);

      // Check if voting is complete after state update
      if (nextIndex >= destinations.length && destinations.length > 0) {
        setVotingComplete(true);
      }
    }, 300); // Match animation duration
  };

  // --- Swipe Handlers ---
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleVote(false),
    onSwipedRight: () => handleVote(true),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Allow dragging with mouse for desktop
  });

  // --- Navigate when voting is complete ---
  useEffect(() => {
    if (votingComplete) {
      console.log("Voting complete. Final votes:", destinations.map(d => ({ id: d.id, likes: d.likes, dislikes: d.dislikes })));

      // TODO: Potentially trigger final aggregation on backend if needed

      // Navigate to results page after a short delay
      const timer = setTimeout(() => {
        navigate(`/results/${groupTripId}`); // Ensure this route exists
      }, 2500); // Give user time to see the "complete" message

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [votingComplete, navigate, groupTripId, destinations]);

  // --- Render Logic ---

  const currentDestination = destinations[currentIndex];
  const progressPercentage = destinations.length > 0
    ? ((currentIndex) / destinations.length) * 100
    : 0;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50">
         <Header />
         <main className="flex-grow flex items-center justify-center">
            <div className="text-center p-8">
                <Loader2 className="w-12 h-12 text-sky-600 animate-spin mx-auto mb-4" />
                <p className="text-sky-700">Loading destination suggestions...</p>
            </div>
         </main>
         <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-sky-50 p-4">
          <div className="max-w-lg w-full mx-auto bg-white rounded-lg shadow-lg p-8 text-center border border-red-200">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              Oops, something went wrong
            </h2>
            <p className="text-red-600 mb-6">
              {error}
            </p>
            <Button
              variant="primary" // Assuming Button has variants
              onClick={fetchDestinations} // Provide a retry mechanism
            >
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Voting Complete State
  if (votingComplete) {
     return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-sky-50 p-4">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Voting Complete!
            </h2>
            <p className="text-gray-600 mb-6">
                Thanks! We're tallying the group's choices now...
            </p>
            <Loader2 className="w-10 h-10 border-sky-blue-500 text-sky-600 animate-spin mx-auto" />
            </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active Voting State
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">

              {/* Header Text & Progress */}
              <div className="max-w-lg mx-auto mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Vote on Destinations</h1>
                <p className="text-gray-600 mb-4">
                  Swipe right to like, swipe left to pass. Let's find the perfect spot!
                </p>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute top-0 left-0 h-full bg-sky-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {remainingVotes} destination{remainingVotes !== 1 ? 's' : ''} remaining
                </p>
              </div>

              {/* Card Stack Area */}
              <div className="relative max-w-md mx-auto h-[550px] md:h-[600px]" {...swipeHandlers}>
                <AnimatePresence mode="wait">
                  {currentDestination ? ( // Check if currentDestination exists
                    <motion.div
                      key={currentDestination.id} // Use unique ID for key
                      className="absolute inset-0"
                      initial={{ opacity: 1, scale: 1 }} // Start visible and normal size
                      animate={{
                        x: direction === 'left' ? -350 : direction === 'right' ? 350 : 0,
                        opacity: direction ? 0 : 1,
                        rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0,
                        scale: direction ? 0.8 : 1, // Shrink slightly when swiped
                      }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }} // Fade out on exit
                      transition={{ type: 'spring', stiffness: 100, damping: 20 }} // Spring animation
                    >
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col border border-gray-100">
                        {/* Image */}
                        <div
                          className="h-64 md:h-72 bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${currentDestination.image})` }}
                          aria-label={`${currentDestination.name}, ${currentDestination.country}`}
                        >
                           {/* Optional: Gradient overlay for text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                           {/* Optional: Like/Dislike indicator overlay */}
                           <AnimatePresence>
                             {direction === 'right' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute top-8 right-8 text-green-400 bg-white/80 rounded-full p-2"
                                >
                                  <ThumbsUp size={32} strokeWidth={3} />
                                </motion.div>
                              )}
                              {direction === 'left' && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                   className="absolute top-8 left-8 text-red-400 bg-white/80 rounded-full p-2"
                                >
                                  <ThumbsDown size={32} strokeWidth={3} />
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>

                        {/* Content */}
                        <div className="flex-grow p-4 md:p-5 overflow-y-auto">
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            {currentDestination.name}
                          </h2>
                           <div className="flex items-center text-gray-600 text-sm mb-3 space-x-2">
                                <MapPin size={16} className="text-sky-600 flex-shrink-0" />
                                <span>{currentDestination.country}</span>
                                <span className="text-gray-300">|</span>
                                <DollarSign size={16} className="text-green-600 flex-shrink-0" />
                                <span title={`Avg. Flight Cost: ~£${currentDestination.totalFlightCost.toFixed(0)}`}>
                                    Price: {currentDestination.priceIndicator}
                                </span>
                            </div>

                          <p className="text-gray-700 mb-4 text-sm md:text-base leading-relaxed">
                            {currentDestination.description}
                          </p>

                          <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Top Highlights:</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentDestination.highlights.length > 0 ? (
                                    currentDestination.highlights.map((highlight, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-xs font-medium bg-sky-100 text-sky-800 rounded-full shadow-sm"
                                    >
                                        {highlight}
                                    </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500 italic">No specific highlights listed.</span>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons (Desktop / Fallback) */}
                        <div className="p-4 border-t border-gray-100 flex justify-center space-x-6 md:space-x-8 bg-gray-50">
                          <button
                            aria-label="Dislike Destination"
                            onClick={() => handleVote(false)}
                            className="w-16 h-16 flex items-center justify-center bg-white border-2 border-red-200 rounded-full text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 shadow-md"
                          >
                            <X size={28} strokeWidth={3}/>
                          </button>
                          <button
                             aria-label="Like Destination"
                            onClick={() => handleVote(true)}
                            className="w-16 h-16 flex items-center justify-center bg-white border-2 border-green-200 rounded-full text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 shadow-md"
                          >
                            <Heart size={28} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    // Optional: Show a message if there are no destinations left but voting isn't marked complete yet
                    !votingComplete && <div className="text-center text-gray-500 pt-20">No more destinations.</div>
                  )}
                </AnimatePresence>
              </div>

              {/* Swipe Instructions */}
              <div className="max-w-md mx-auto mt-6 md:mt-8 bg-sky-100/70 rounded-lg p-4 flex justify-around items-center text-sm text-sky-800 shadow-sm">
                <div className="flex items-center space-x-2">
                  <X size={20} className="text-red-500" />
                  <span>Swipe Left (Pass)</span>
                </div>
                <div className="flex items-center space-x-2">
                   <Heart size={20} className="text-green-500" />
                  <span>Swipe Right (Like)</span>
                </div>
              </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChooseDestinationPage;