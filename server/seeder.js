import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import tours from './data/tours.js';
import coupons from './data/coupons.js';
import User from './models/userModel.js';
import Tour from './models/tourModel.js';
import Booking from './models/bookingModel.js';
import Coupon from './models/couponModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Tour.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleTours = tours.map((tour) => {
      return { ...tour, user: adminUser };
    });
    
    const sampleCoupons = coupons.map((coupon) => {
        return { ...coupon, user: adminUser };
    });

    await Tour.insertMany(sampleTours);
    await Coupon.insertMany(sampleCoupons);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Tour.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}