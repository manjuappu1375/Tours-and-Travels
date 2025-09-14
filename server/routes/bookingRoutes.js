import express from 'express';
const router = express.Router();
import {
  addBookingItems,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addBookingItems);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/all').get(protect, admin, getAllBookings);
router.route('/:id/cancel').put(protect, cancelBooking);


export default router;