import { createRedisNativeClient } from "./redis";

export async function getPubSubClients() {
	const pubClient = await createRedisNativeClient();
	const subClient = await createRedisNativeClient();
	return {
		pubClient,
		subClient,
	};
}
