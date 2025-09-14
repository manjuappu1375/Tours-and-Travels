import React from 'react';
import { Link } from 'react-router-dom';
import { Tour } from '../types';
import { useWishlist } from '../contexts/WishlistContext';

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { isTourInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isTourInWishlist(tour._id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating when clicking the heart
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(tour._id);
    } else {
      addToWishlist(tour._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="relative">
        <img src={tour.images[0]} alt={tour.title} className="w-full h-56 object-cover" />
        <button
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 truncate">{tour.title}</h3>
        <p className="text-light-text mb-1">{tour.location}, {tour.state}</p>
        <p className="text-lg font-semibold text-primary mb-4">₹{tour.price.toLocaleString()}</p>
        <div className="flex flex-col space-y-2">
            <Link to={`/tours/${tour._id}`} className="w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors">
                View Details
            </Link>
            <button className="w-full bg-secondary text-white py-2 rounded-md hover:bg-secondary-dark transition-colors">
                Book Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;