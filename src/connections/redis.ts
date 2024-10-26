import Redis from "ioredis";
import { createClient } from "redis";

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = process.env;

export function createRedisClient() {
	return new Redis(parseInt(REDIS_PORT), REDIS_HOST, {
		password: REDIS_PASSWORD,
		db: parseInt(REDIS_DB),
	});
}
export async function createRedisNativeClient() {
	return await createClient({
		password: REDIS_PASSWORD,
		url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
		database: parseInt(REDIS_DB),
	})
		.on("error", (err) => console.log("Redis Client Error", err))
		.connect();
}
