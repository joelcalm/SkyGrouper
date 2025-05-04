// ResultsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { BackgroundDecoration } from '../components/BackgroundDecoration';
import {
  Plane,
  MapPin,
  ArrowLeftCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type Leg = {
  date: string;
  time: string;
  price: number;
  booking_link: string;
};

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
    outbound: Leg;
    return: Leg;
  }[];
  totals: { total_flight_cost: number };
};

interface LocationState {
  results?: { plans: Plan[] };
}

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  /* ------------------------------------------------------------------ */
  /* 1️⃣  Safety check – if user refreshes & state is lost, bounce home  */
  /* ------------------------------------------------------------------ */
  const allPlans = state?.results?.plans;
  useEffect(() => {
    if (!allPlans) navigate('/');
  }, [allPlans, navigate]);

  /* ------------------------------------------------------------------ */
  /* 2️⃣  Pick ONE plan (take the first)                                 */
  /* ------------------------------------------------------------------ */
  const plan = allPlans?.[0];
  const cheapestFlight = useMemo(() => {
    if (!plan?.flights?.length) return null;
    return [...plan.flights].sort(
      (a, b) => a.outbound.price - b.outbound.price
    )[0];
  }, [plan]);

  /* ------------------------------------------------------------------ */
  /* 3️⃣  UI helpers                                                     */
  /* ------------------------------------------------------------------ */
  const [showMore, setShowMore] = useState(false);
  const toggleMore = () => setShowMore((s) => !s);

  if (!plan) return null; // already redirected if empty
  const { destination, totals } = plan;

  /* ------------------------------------------------------------------ */
  /* 4️⃣  Render                                                         */
  /* ------------------------------------------------------------------ */
  return (
    <Layout>
      <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
        <BackgroundDecoration />

        <div className="container mx-auto px-4 py-12 relative z-10 max-w-3xl">
          {/* Back */}
          <button
            className="inline-flex items-center mb-6 text-sky-600 hover:text-sky-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftCircle className="mr-1" size={20} />
            Back
          </button>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Header */}
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
              Trip&nbsp;Highlights
            </h2>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              {destination.top_highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            {/* Cheapest flight */}
            {cheapestFlight && (
              <>
                <h2 className="mt-8 mb-2 text-xl font-semibold text-gray-800">
                  Cheapest Flight&nbsp;
                  <span className="text-sm text-gray-500">(found for you)</span>
                </h2>

                <div className="border border-sky-100 rounded-xl p-4">
                  {/* header line */}
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {cheapestFlight.airline}
                      </p>
                      <p className="text-sm text-gray-600">
                        {cheapestFlight.flight_no} &bull; dep&nbsp;
                        {cheapestFlight.departure_airport}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-1">
                      <Plane className="text-sky-600" size={20} />
                      <span className="font-semibold text-gray-800">
                        €
                        {cheapestFlight.outbound.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* legs */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* outbound */}
                    <div className="p-3 bg-sky-50 rounded-lg text-sm">
                      <p className="font-semibold text-gray-700 mb-1">
                        Outbound
                      </p>
                      <p className="text-gray-600">
                        {cheapestFlight.outbound.date} &nbsp;
                        {cheapestFlight.outbound.time}
                      </p>
                      <a
                        href={cheapestFlight.outbound.booking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-sky-600 hover:text-sky-800 underline"
                      >
                        Book now
                        <ExternalLink className="ml-1" size={14} />
                      </a>
                    </div>

                    {/* return */}
                    <div className="p-3 bg-sky-50 rounded-lg text-sm">
                      <p className="font-semibold text-gray-700 mb-1">
                        Return
                      </p>
                      <p className="text-gray-600">
                        {cheapestFlight.return.date} &nbsp;
                        {cheapestFlight.return.time}
                      </p>
                      <a
                        href={cheapestFlight.return.booking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-sky-600 hover:text-sky-800 underline"
                      >
                        Book now
                        <ExternalLink className="ml-1" size={14} />
                      </a>
                    </div>
                  </div>

                  {/* total */}
                  <p className="mt-3 text-sm text-gray-600">
                    Round-trip flight total for this plan:&nbsp;
                    <span className="font-semibold text-gray-800">
                      €{totals.total_flight_cost.toFixed(2)}
                    </span>
                  </p>
                </div>
              </>
            )}

            {/* Other flights collapsible */}
            {plan.flights.length > 1 && (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={toggleMore}
                  className="flex items-center text-sky-600 hover:text-sky-800 mb-2"
                >
                  {showMore ? (
                    <ChevronUp size={18} className="mr-1 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="mr-1 shrink-0" />
                  )}
                  {showMore ? 'Hide' : 'Show'} other flight options
                </button>

                {showMore && (
                  <ul className="space-y-4">
                    {plan.flights
                      .filter((f) => f !== cheapestFlight)
                      .map((f, i) => (
                        <li
                          key={`${f.flight_no}-${i}`}
                          className="border border-sky-100 rounded-xl p-4 text-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <span className="font-medium text-gray-800">
                                {f.airline}
                              </span>
                              <span className="text-gray-600">
                                {' '}
                                – {f.flight_no}
                              </span>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center space-x-1">
                              <Plane className="text-sky-600" size={18} />
                              <span className="font-semibold text-gray-800">
                                €{f.outbound.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* outbound link */}
                            <a
                              href={f.outbound.booking_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sky-600 hover:text-sky-800 underline"
                            >
                              Outbound&nbsp;
                              <ExternalLink size={14} className="ml-0.5" />
                            </a>

                            {/* return link */}
                            <a
                              href={f.return.booking_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sky-600 hover:text-sky-800 underline"
                            >
                              Return&nbsp;
                              <ExternalLink size={14} className="ml-0.5" />
                            </a>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
