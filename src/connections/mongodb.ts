import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import { getLogger } from "../utils/logger";

dotenv.config();

// Load environment variables from .env file
const CONNECTION_URI = process.env.MONGO_DB_CONNECTION_URI;

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
	return mongoose
		.connect(CONNECTION_URI, options)
		.then(() => {
			logger.success("Connected to MongoDB");
		})
		.catch((error) => {
			logger.error("Error connecting to MongoDB", error);
		});
}
