import asyncHandler from 'express-async-handler';
import Tour from '../models/tourModel.js';
import { generateTravelTip } from '../utils/geminiService.js';


// @desc    Fetch all tours
// @route   GET /api/tours
// @access  Public
const getTours = asyncHandler(async (req, res) => {
  const { keyword, state } = req.query;
  const query = {};

  if (state) {
    // Case-insensitive regex search for the state
    query.state = { $regex: new RegExp(`^${state}$`, 'i') };
  }

  if (keyword) {
    const searchRegex = { $regex: keyword, $options: 'i' };
    query.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { state: searchRegex },
      { description: searchRegex },
    ];
  }

  const tours = await Tour.find({ ...query });
  res.json(tours);
});

// @desc    Fetch single tour
// @route   GET /api/tours/:id
// @access  Public
const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (tour) {
    res.json(tour);
  } else {
    res.status(404);
    throw new Error('Tour not found');
  }
});


// @desc    Create new review
// @route   POST /api/tours/:id/reviews
// @access  Private
// NOTE: This function requires a database connection to work. It will fail if not connected.
const createTourReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const tour = await Tour.findById(req.params.id);

  if (tour) {
    const alreadyReviewed = tour.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Tour already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    tour.reviews.push(review);

    tour.numReviews = tour.reviews.length;
    tour.rating =
      tour.reviews.reduce((acc, item) => item.rating + acc, 0) /
      tour.reviews.length;

    await tour.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Tour not found in database. Cannot add review.');
  }
});

// @desc    Generate a travel tip for a tour
// @route   POST /api/tours/tip
// @access  Public
const generateTourTip = asyncHandler(async (req, res) => {
  const { tourTitle, tourLocation } = req.body;

  if (!tourTitle || !tourLocation) {
    res.status(400);
    throw new Error('Tour title and location are required');
  }

  const tip = await generateTravelTip(tourTitle, tourLocation);
  res.json({ tip });
});


export { getTours, getTourById, createTourReview, generateTourTip };