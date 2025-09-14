import asyncHandler from 'express-async-handler';
import Tour from '../models/tourModel.js';
// To ensure the application is browsable even without a database connection,
// we will use the static tours data as a fallback/primary source.
import toursData from '../data/tours.js';
import { generateTravelTip } from '../utils/geminiService.js';


// @desc    Fetch all tours
// @route   GET /api/tours
// @access  Public
const getTours = asyncHandler(async (req, res) => {
  // This controller now serves static data from `data/tours.js` to prevent
  // the "Failed to fetch tours" error when a database is not connected.
  const { keyword, state } = req.query;
  let filteredTours = toursData;

  if (state) {
    filteredTours = filteredTours.filter(tour =>
      tour.state.toLowerCase() === state.toLowerCase()
    );
  }

  if (keyword) {
    const lowercasedKeyword = keyword.toLowerCase();
    filteredTours = filteredTours.filter(tour =>
      tour.title.toLowerCase().includes(lowercasedKeyword) ||
      tour.location.toLowerCase().includes(lowercasedKeyword) ||
      tour.state.toLowerCase().includes(lowercasedKeyword) ||
      tour.description.toLowerCase().includes(lowercasedKeyword) ||
      (tour.itinerary && tour.itinerary.some(day => 
        day.title.toLowerCase().includes(lowercasedKeyword) ||
        day.description.toLowerCase().includes(lowercasedKeyword)
      ))
    );
  }
  
  res.json(filteredTours);
});

// @desc    Fetch single tour
// @route   GET /api/tours/:id
// @access  Public
const getTourById = asyncHandler(async (req, res) => {
  // Find the base tour data from the static file.
  const staticTour = toursData.find((t) => t._id === req.params.id);

  if (staticTour) {
    try {
      // Attempt to find the tour in the database to fetch dynamic data like reviews.
      // This will fail gracefully if the database is not connected.
      const dbTour = await Tour.findById(req.params.id);
      if (dbTour) {
        // If found in DB, combine them. Precedence to DB data for dynamic fields.
        const responseTour = {
          ...staticTour,
          reviews: dbTour.reviews,
          rating: dbTour.rating,
          numReviews: dbTour.numReviews,
        };
        res.json(responseTour);
      } else {
        // If not in DB, serve the static data as is.
        res.json(staticTour);
      }
    } catch (error) {
      // If the database call fails, log the error and fall back to serving static data.
      console.warn(`DB fetch for tour ${req.params.id} failed. Serving static data. Error: ${error.message}`);
      res.json(staticTour);
    }
  } else {
    // If the tour isn't in the static file, it doesn't exist.
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