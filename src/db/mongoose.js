import mongoose from 'mongoose';
import env from '../utils/env.js';

export async function connectToMongo() {
  if (!env.mongo_uri) {
    throw new Error('MongoDB connection string (mongo_uri) not set in environment variables');
  }
  try {
    await mongoose.connect(env.mongo_uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}
