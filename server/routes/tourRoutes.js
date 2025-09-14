import express from 'express';
const router = express.Router();
import {
  getTours,
  getTourById,
  createTourReview,
  generateTourTip,
} from '../controllers/tourController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getTours);
router.route('/tip').post(generateTourTip);
router.route('/:id').get(getTourById);
router.route('/:id/reviews').post(protect, createTourReview);

export default router;
