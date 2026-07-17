import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`Successfully connected to MongoDB database: Datewheel`);
  } catch (error) {
    console.error(`Error connecting to MongoDB:`, error);
    process.exit(1);
  }
};
