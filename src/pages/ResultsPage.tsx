// ResultsPage.tsx
import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';
import { Plane, MapPin, ArrowLeftCircle } from 'lucide-react';

type Plan = {
  destination: {
    city: string;
    country: string;
    summary: string;
    top_highlights: string[];
  };
  flights: {
    airline: string;
    departure_airport: string;
    flight_no: string;
    outbound: { date: string; time: string; price: number; booking_link: string };
    return:   { date: string; time: string; price: number; booking_link: string };
  }[];
  totals: { total_flight_cost: number };
};

interface LocationState {
  results?: { plans: Plan[] };
}

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  /** ------------------------------------------------------------------
   * 1️⃣  Safety check – if user refreshes & state is lost, bounce home
   * ------------------------------------------------------------------ */
  const allPlans = state?.results?.plans;
  useEffect(() => {
    if (!allPlans) navigate('/');
  }, [allPlans, navigate]);

  /** ------------------------------------------------------------------
   * 2️⃣  Pick ONE plan to show – here we simply take the first (index 0)
   *     → swap for any selection logic you like (best score, cheapest…)
   * ------------------------------------------------------------------ */
  const plan = allPlans?.[0];
  const cheapestFlight = useMemo(() => {
    if (!plan?.flights?.length) return null;
    return [...plan.flights].sort(
      (a, b) => a.outbound.price - b.outbound.price
    )[0];
  }, [plan]);

  if (!plan) return null; // has already redirected if empty

  /* ------------------------------------------------------------------- */
  /* 3️⃣  Render nicely formatted card for that single destination        */
  /* ------------------------------------------------------------------- */
  const { destination, totals } = plan;

  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10 max-w-3xl">
          {/* Back link */}
          <button
            className="inline-flex items-center mb-6 text-sky-600 hover:text-sky-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftCircle className="mr-1" size={20} />
            Back
          </button>

          {/* Destination header */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center">
              <MapPin className="text-sky-600 mr-2" size={32} />
              {destination.city}, {destination.country}
            </h1>

            {/* Summary */}
            <p className="mt-4 text-gray-700 leading-relaxed">
              {destination.summary}
            </p>

            {/* Highlights */}
            <h2 className="mt-6 mb-2 text-xl font-semibold text-gray-800">
              Trip Highlights
            </h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              {destination.top_highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            {/* Cheapest flight (if any) */}
            {cheapestFlight && (
              <>
                <h2 className="mt-8 mb-2 text-xl font-semibold text-gray-800">
                  Example Flight <span className="text-sm text-gray-500">(cheapest found)</span>
                </h2>
                <div className="border border-sky-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-gray-800">
                      {cheapestFlight.airline}
                    </span>
                    <span className="text-sm text-gray-600">
                      {cheapestFlight.flight_no} &bull; dep {cheapestFlight.departure_airport}
                    </span>
                    <span className="text-sm text-gray-600">
                      {cheapestFlight.outbound.date} @ {cheapestFlight.outbound.time}
                    </span>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                    <Plane className="text-sky-600 shrink-0" size={20} />
                    <span className="font-semibold text-gray-800">
                      €{cheapestFlight.outbound.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Totals */}
                <p className="mt-2 text-sm text-gray-600">
                  Round-trip flight total for this plan: 
                  <span className="font-semibold text-gray-800">
                    €{totals.total_flight_cost.toFixed(2)}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
