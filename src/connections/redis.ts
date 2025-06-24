import { createClient } from "redis";

const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_DB } = process.env;

export async function createRedisNativeClient() {
	return await createClient({
		password: REDIS_PASSWORD,
		url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
		database: parseInt(REDIS_DB),
	})
		.on("error", (err) => console.log("Redis Client Error", err))
		.connect();
}
