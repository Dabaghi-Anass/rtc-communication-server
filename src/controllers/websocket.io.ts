import { Server } from "socket.io";
import { getPubSubClients } from "../connections/pub-sub";
import { RedisChannels } from "../constants/redis-channels";
import { IoChatEvent } from "../constants/socketio";
import { getLogger } from "../utils/logger";

function publishDisconnectEvent(socket, publisher) {
	socket.broadcast.emit(IoChatEvent.USER_OFFLINE, "user left");
	publisher.publish(
		RedisChannels.USER_OFFLINE_CHANNEL,
		JSON.stringify({ status: "offline" })
	);
}
export async function handleSocketConnections(io: Server): Promise<void> {
	//pub client to publish messages to redis
	const { pubClient, subClient } = await getPubSubClients();
	const logger = await getLogger();
	logger.success("Socket.io server started");

	//subscribe to messages channel
	subClient.subscribe(
		RedisChannels.MESSAGE_CREATED_CHANNEL,
		(message, channel) => {
			if (message) {
				logger.warn(
					`reseived message from channel: ${channel}`,
					JSON.parse(message)
				);
			}
		}
	);

	//subscribe to user offline channel
	subClient.subscribe(
		RedisChannels.USER_OFFLINE_CHANNEL,
		(message, channel) => {
			if (message) {
				logger.warn(
					`reseived message from channel: ${channel}`,
					JSON.parse(message)
				);
			}
		}
	);

	io.on("connection", (socket) => {
		logger.info("Client connected", socket.id);

		//join room event
		socket.on(IoChatEvent.JOIN_ROOM, (room) => {
			logger.info(`User joined room: ${room}`);
			socket.join(room);
		});

		//leave room event
		socket.on(IoChatEvent.LEAVE_ROOM, (room) => {
			logger.info(`User left room: ${room}`);
			socket.leave(room);
		});

		//message event
		socket.on(IoChatEvent.MESSAGE, (data) => {
			logger.info("Message received: ", data);
			pubClient.publish(
				RedisChannels.MESSAGE_CREATED_CHANNEL,
				JSON.stringify(data)
			);
			socket.broadcast.emit(IoChatEvent.MESSAGE, data);
		});

		//typing event
		socket.on(IoChatEvent.TYPING, (data) => {
			logger.info("Typing event received: ", data);
			socket.broadcast.emit(IoChatEvent.TYPING, data);
		});

		//typing stop event
		socket.on(IoChatEvent.TYPING_STOP, (data) => {
			logger.info("Typing stop event received: ", data);
			socket.broadcast.emit(IoChatEvent.TYPING_STOP, data);
		});
		//disconnect event
		socket.on("disconnect", () =>
			publishDisconnectEvent(socket, pubClient)
		);
	});
}
