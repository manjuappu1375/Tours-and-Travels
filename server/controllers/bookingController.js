import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';
import Coupon from '../models/couponModel.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = asyncHandler(async (req, res) => {
  const { tourId, bookingDate, travelers, couponCode } = req.body;

  if (!tourId || !bookingDate || !travelers) {
    res.status(400);
    throw new Error('Missing booking details');
  }

  const tour = await Tour.findById(tourId);

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  let finalPrice = tour.price * Number(travelers);
  let couponAppliedData = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon || !coupon.isActive || new Date(coupon.expiryDate) < new Date()) {
      res.status(400);
      throw new Error('Invalid or expired coupon code.');
    }
    
    const discount = finalPrice * (coupon.discountPercentage / 100);
    finalPrice -= discount;
    couponAppliedData = {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage
    };
  }

  const booking = new Booking({
    user: req.user._id,
    tour: tourId,
    bookingDate,
    travelers: Number(travelers),
    totalPrice: finalPrice,
    status: 'confirmed', // For simplicity, auto-confirm bookings
    couponApplied: couponAppliedData,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('tour', 'title location images')
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
      .populate('tour', 'title')
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
});

// @desc    Update booking to cancelled
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }
    
    // Check if user is booking owner or an admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to cancel this booking');
    }

    if (booking.status === 'cancelled') {
        res.status(400);
        throw new Error('Booking is already cancelled');
    }

    booking.status = 'cancelled';
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
        .populate('tour', 'title location images')
        .populate('user', 'name');

    res.json(populatedBooking);
});

export { addBookingItems, getMyBookings, getAllBookings, cancelBooking };