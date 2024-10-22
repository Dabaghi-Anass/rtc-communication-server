import Redis from "ioredis";
import { getLogger } from "../utils/logger";

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = process.env;

var redisClient = new Redis(REDIS_PORT, REDIS_HOST, {
	password: REDIS_PASSWORD,
	db: REDIS_DB,
});

redisClient.on("connect", async () => {
	const logger = await getLogger();
	logger.success("Connected to Redis");
});

redisClient.on("error", (err) => {
	console.error("Error connecting to Redis: ", err);
});

export default redisClient;
