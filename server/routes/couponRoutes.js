import express from 'express';
const router = express.Router();
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  applyCoupon
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.route('/apply').post(protect, applyCoupon);
  
router.route('/:id')
  .put(protect, admin, updateCoupon);


export default router;
