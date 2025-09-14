import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in the .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Please ensure your MONGO_URI in the server/.env file is correct and MongoDB is running.');
    process.exit(1);
  }
};

export default connectDB;
