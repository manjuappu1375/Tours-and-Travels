import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tour, Review, DailyItinerary } from '../types';
import { getTourById } from '../services/tourService';
import BookingForm from '../components/BookingForm';
import { useWishlist } from '../contexts/WishlistContext';
import TravelTip from '../components/TravelTip';

const TourDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeDay, setActiveDay] = useState<number | null>(1); // For accordion, default to day 1 open
  const { isTourInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchTour = async () => {
      if (id) {
        try {
            setLoading(true);
            setError(null);
            const fetchedTour = await getTourById(id);
            setTour(fetchedTour || null);
        } catch (err: any) {
            console.error("Failed to fetch tour details", err);
            if (err.code === 'ERR_NETWORK') {
                setError('Network Error: Could not connect to the server. Please ensure the backend is running.');
            } else if (err.response?.status === 404) {
                setError('Tour not found.');
            } else {
                setError('An unexpected error occurred while fetching the tour details.');
            }
            setTour(null);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchTour();
  }, [id]);

  const nextImage = () => {
    if (!tour) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === tour.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!tour) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? tour.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div className="text-center py-20">Loading tour details...</div>;
  }

  if (error) {
    return (
        <div className="text-center py-20 bg-red-100 text-red-700 p-6 rounded-lg container mx-auto">
            <h3 className="font-bold text-xl mb-2">Failed to Load Tour</h3>
            <p>{error}</p>
        </div>
    );
  }

  if (!tour) {
    return <div className="text-center py-20">Tour not found.</div>;
  }

  const inWishlist = isTourInWishlist(tour._id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(tour._id);
    } else {
      addToWishlist(tour._id);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="lg:flex lg:space-x-12">
        {/* Left Side: Images and Details */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">{tour.title}</h1>
            <button
              onClick={handleWishlistToggle}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:bg-red-50 text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-semibold hidden sm:block">{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
          <p className="text-lg text-light-text mb-4">{tour.location}, {tour.state}</p>
          
          {/* Image Carousel Section */}
          <div className="mb-8">
            <div className="relative mb-2 rounded-lg overflow-hidden shadow-lg">
              <img 
                key={currentImageIndex}
                src={tour.images[currentImageIndex]} 
                alt={`${tour.title} - view ${currentImageIndex + 1}`} 
                className="w-full h-96 object-cover animate-fade-in"
              />
              {tour.images.length > 1 && (
                <>
                  <button onClick={prevImage} aria-label="Previous image" className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm text-dark-text p-2 rounded-full shadow-md transition hover:bg-white z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextImage} aria-label="Next image" className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm text-dark-text p-2 rounded-full shadow-md transition hover:bg-white z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
            {tour.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {tour.images.map((image, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`rounded-md overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index ? 'border-primary' : 'border-transparent hover:border-gray-300'}`} aria-label={`View image ${index + 1}`}>
                    <img src={image} alt={`Thumbnail of ${tour.title} ${index + 1}`} className="w-full h-16 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4 border-b pb-2">About this tour</h2>
          <p className="text-gray-700 leading-relaxed mb-8">{tour.description}</p>
          
          <TravelTip tourTitle={tour.title} tourLocation={tour.location} />

          {/* Daily Itinerary Section */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Daily Itinerary</h2>
              <div className="space-y-2">
                {tour.itinerary.map((day: DailyItinerary) => (
                   <div key={day.day} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveDay(activeDay === day.day ? null : day.day)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                      aria-expanded={activeDay === day.day}
                    >
                      <h3 className="font-semibold text-lg text-left">
                        <span className="text-primary font-bold">Day {day.day}:</span> {day.title}
                      </h3>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transition-transform transform ${activeDay === day.day ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeDay === day.day && (
                      <div className="p-4 bg-white border-t">
                        <p className="text-gray-600">{day.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-28">
             <div className="mb-4">
              <span className="text-3xl font-bold text-primary">₹{tour.price.toLocaleString()}</span>
              <span className="text-base font-normal text-light-text">/person</span>
            </div>
            <BookingForm tour={tour} />
          </div>
        </div>
      </div>

       {/* Reviews Section */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Reviews ({tour.reviews.length})</h2>
            <div className="space-y-6">
                {tour.reviews.length > 0 ? tour.reviews.map((review: Review) => (
                    <div key={review._id} className="flex space-x-4">
                         <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
                           {review.name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-semibold">{review.name}</p>
                            <div className="flex items-center">
                                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                                <span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{review.comment}</p>
                         </div>
                    </div>
                )) : <p>No reviews yet.</p>}
            </div>
        </div>
    </div>
  );
};

export default TourDetailsPage;