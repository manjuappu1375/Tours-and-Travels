
import React, { useState, useEffect } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { getTours } from '../services/tourService';
import { Tour } from '../types';
import TourCard from '../components/TourCard';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const [wishlistTours, setWishlistTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        if (wishlist.length > 0) {
          const allTours = await getTours();
          const filteredTours = allTours.filter(tour => wishlist.includes(tour._id));
          setWishlistTours(filteredTours);
        } else {
          setWishlistTours([]);
        }
      } catch (error) {
        console.error("Failed to fetch tours for wishlist", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [wishlist]);

  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-300px)]">
      <h1 className="text-4xl font-bold mb-8 text-center">My Wishlist</h1>
      {loading ? (
        <div className="text-center">Loading wishlist...</div>
      ) : wishlistTours.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistTours.map(tour => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-semibold">Your Wishlist is Empty</h3>
            <p className="text-light-text mt-2">Looks like you haven't saved any tours yet. Start exploring to find your next adventure!</p>
            <Link to="/explore" className="mt-6 inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Explore Tours
            </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;