import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TourCard from '../components/TourCard';
import { Tour } from '../types';
import { getTours } from '../services/tourService';

const ExplorePage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const state = searchParams.get('state') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const allTours = await getTours({ keyword: query, state });
        setTours(allTours);
      } catch (error) {
        console.error("Failed to fetch tours", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
    setSearchTerm(query); // Sync input with URL param on navigation
  }, [query, state]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };
  
  const pageTitle = state ? `Tours in ${state}` : 'Explore All Our Tours';
  const pageDescription = state ? `Discover the best experiences ${state} has to offer.` : 'Find your next adventure from our collection of curated experiences.';

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">{pageTitle}</h1>
      <p className="text-center text-light-text mb-8">{pageDescription}</p>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text"
            placeholder="Search tours, locations, or states..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
          />
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16">Loading...</div>
      ) : tours.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tours.map(tour => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold">No Tours Found</h3>
          <p className="text-light-text mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;