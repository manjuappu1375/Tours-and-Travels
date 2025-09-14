
import { Booking } from '../types';
import api from './api';

interface CreateBookingData {
    tourId: string;
    bookingDate: string;
    travelers: number;
    couponCode?: string;
}

export const createBooking = async (bookingData: CreateBookingData): Promise<Booking> => {
  const { data } = await api.post('/bookings', bookingData);
  return data;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const { data } = await api.get('/bookings/mybookings');
  return data;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  const { data } = await api.put(`/bookings/${bookingId}/cancel`);
  return data;
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const { data } = await api.get('/bookings/all');
  return data;
};