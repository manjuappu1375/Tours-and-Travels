export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  token?: string;
}

export interface Review {
  _id: string;
  user: string; // userId
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface DailyItinerary {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  _id: string;
  title: string;
  location: string;
  state: string;
  price: number;
  duration: number; // in days
  description: string;
  images: string[];
  category: 'Adventure' | 'Relaxation' | 'Cultural' | 'Nature' | 'Spiritual';
  reviews: Review[];
  rating: number; // average rating
  numReviews: number;
  itinerary: DailyItinerary[];
}

export interface Booking {
  _id: string;
  tour: { // Populated from Tour model
    _id: string;
    title: string;
    location: string;
    images: string[];
  };
  user: { // Populated from User model
    _id: string;
    name: string;
  };
  bookingDate: string;
  travelers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  couponApplied?: {
    code: string;
    discountPercentage: number;
  };
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expiryDate: string;
  isActive: boolean;
}