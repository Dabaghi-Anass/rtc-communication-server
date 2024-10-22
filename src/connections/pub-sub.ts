import Redis from "ioredis";
import { getLogger } from "../utils/logger";

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = process.env;

var pubClient: Redis = new Redis(REDIS_PORT, REDIS_HOST, {
	password: REDIS_PASSWORD,
	db: REDIS_DB,
});
const subClient = Redis(REDIS_PORT, REDIS_HOST, {
	password: REDIS_PASSWORD,
	db: REDIS_DB,
});
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

	return { pubClient, subClient };
}
