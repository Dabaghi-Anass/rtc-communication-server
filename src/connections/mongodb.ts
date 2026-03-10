import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';
import { getLogger } from '../utils/logger';

dotenv.config();

// Load environment variables from .env file
const DB_NAME = process.env.MONGO_DB_NAME || 'rtc-messages';
const DB_USER = process.env.MONGO_DB_USER || 'admin';
const DB_PASSWORD = process.env.MONGO_DB_PASSWORD || 'password';
const DB_HOST = process.env.MONGO_DB_HOST || 'localhost';
const DB_PORT = process.env.MONGO_DB_PORT || '27017';

/**
 * This function connects to the MongoDB database
 * @returns Promise<void>
 */
export async function connectDatabase(): Promise<void> {
  const logger = await getLogger();
  const options: ConnectOptions = {
    minPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoCreate: true,
  };

  // support full connection URI or individual components
  const uri = process.env.MONGO_DB_CONNECTION_URI
    ? process.env.MONGO_DB_CONNECTION_URI
    : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  await mongoose
    .connect(uri, options)
    .then(() => {
      logger.success('Connected to MongoDB');
    })
    .catch((err) => {
      logger.error('Failed to connect to MongoDB', { error: err });
      process.exit(1);
    });
}
