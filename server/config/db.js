import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  // The MONGO_URI is optional for local development. If it's not provided,
  // the application will run in a "demo mode" where tour data is served
  // from static files. Features requiring a database (login, booking, reviews)
  // will not work until a valid MONGO_URI is provided.
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not found in .env file. Server is running in demo mode.');
    console.warn('Database-dependent features like login, booking, and reviews will be disabled.');
    console.warn('To enable all features, please provide a valid MONGO_URI in server/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Please ensure your MONGO_URI in the server/.env file is correct and MongoDB is running.');
    // We do NOT exit the process. This allows the server to start up and run in
    // a degraded "demo mode," which prevents the "Network Error" on the frontend.
  }
};

export default connectDB;
