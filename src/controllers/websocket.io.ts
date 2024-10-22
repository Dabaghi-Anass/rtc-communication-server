import { Server } from "socket.io";
import { getPubSubClients } from "../connections/pub-sub";
import { RedisChannels } from "../constants/redis-channels";
import { IoChatEvent } from "../constants/socketio";
import { getLogger } from "../utils/logger";

function publishDisconnectEvent(socket, logger) {
	logger.info("Client disconnected");
	socket.broadcast.emit(IoChatEvent.USER_OFFLINE, "user left");
}
export async function handleSocketConnections(io: Server): Promise<void> {
	//pub client to publish messages to redis
	const { pubClient, subClient } = await getPubSubClients();
	const logger = await getLogger();
	logger.success("Socket.io server started");

	//subscribe to channel
	subClient.subscribe(RedisChannels.MESSAGES_CHANNEL, (err, count) => {
		if (err) {
			logger.error("Error subscribing to channel: ", err);
		}
		logger.info(`Subscribed to ${count} channel`);
	});

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
				RedisChannels.MESSAGES_CHANNEL,
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
		socket.on("disconnect", () => publishDisconnectEvent(socket, logger));
	});
	subClient.subscribe(RedisChannels.MESSAGES_CHANNEL, (err, count) => {
		if (err) {
			logger.error("Error subscribing to channel: ", err);
		}
		logger.info(`Subscribed to ${count} channel`);
	});
	subClient.on("message", (channel, message) => {
		logger.info("Message received from channel: ", message);
		io.emit(IoChatEvent.MESSAGE, JSON.parse(message));
	});
}
