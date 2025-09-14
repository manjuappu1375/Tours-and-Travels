import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import TourCard from '../components/TourCard';
import { Tour } from '../types';
import { getTours } from '../services/tourService';

const HomePage: React.FC = () => {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const tours = await getTours();
        // Shuffle tours to get a random selection for featured
        const shuffled = tours.sort(() => 0.5 - Math.random());
        setFeaturedTours(shuffled.slice(0, 8)); // Show 8 featured tours
      } catch (err: any) {
        console.error("Failed to fetch tours", err);
        if (err.code === 'ERR_NETWORK') {
          setError('Network Error: Could not connect to the server. Please ensure the backend server is running and configured correctly. See the README for setup instructions.');
        } else {
          setError('An unexpected error occurred while fetching tours.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <div>
      <HeroSection />

      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="⭐"
            title="Curated Tours"
            description="Hand-picked destinations to match every vibe."
          />
          <FeatureCard 
            icon="🔥"
            title="Trending Spots"
            description="See what's hot this season across the globe."
          />
          <FeatureCard 
            icon="✈️"
            title="Traveler Stories"
            description="Get inspired by experiences shared by real travelers."
          />
        </div>
      </section>

      <section className="bg-light-bg py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Tours</h2>
          {loading ? (
            <div className="text-center">Loading tours...</div>
          ) : error ? (
            <div className="text-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-2">Failed to Load Tours</h3>
                <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredTours.map(tour => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;