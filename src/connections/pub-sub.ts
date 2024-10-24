import Redis from "ioredis";
import { getLogger } from "../utils/logger";
import { createRedisClient } from "./redis";

const pubClient: Redis = createRedisClient();
const subClient: Redis = createRedisClient();

Promise.all([pubClient.connect(), subClient.connect()]);

export async function getPubSubClients() {
	const logger = await getLogger();

	pubClient.on("connect", () => {
		logger.info("Connected to Redis publisher");
	});
	subClient.on("connect", () => {
		logger.info("Connected to Redis subscriber");
	});

	subClient.on("error", (err) => {
		logger.error("Error connecting to Redis subscriber: ", err);
	});
	pubClient.on("error", (err) => {
		logger.error("Error connecting to Redis publisher: ", err);
	});
	return {
		pubClient,
		subClient,
	};
}
