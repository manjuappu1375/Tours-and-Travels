import asyncHandler from 'express-async-handler';
import Coupon from '../models/couponModel.js';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expiryDate } = req.body;

  const couponExists = await Coupon.findOne({ code });

  if (couponExists) {
    res.status(400);
    throw new Error('Coupon with this code already exists');
  }

  const coupon = new Coupon({
    code,
    discountPercentage,
    expiryDate,
    user: req.user._id,
  });

  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Update a coupon (e.g., toggle isActive)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    coupon.isActive = isActive;
    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Apply a coupon
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
        res.status(400);
        throw new Error('This coupon is not active');
    }

    if (new Date(coupon.expiryDate) < new Date()) {
        res.status(400);
        throw new Error('This coupon has expired');
    }

    res.json({
        _id: coupon._id,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
    });
});


export { createCoupon, getCoupons, updateCoupon, applyCoupon };
