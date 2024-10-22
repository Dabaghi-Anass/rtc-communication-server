import { Server } from "socket.io";
import { IoChatEvent } from "../constants/socketio";
import { getLogger } from "../utils/logger";

export async function handleSocketConnections(io: Server): Promise<void> {
	const logger = await getLogger();
	logger.success("Socket.io server started");
	io.on("connection", (socket) => {
		logger.info("Client connected");
		socket.broadcast.emit(IoChatEvent.USER_ONLINE, "user joined");
		socket.on("disconnect", () => {
			logger.info("Client disconnected");
			socket.broadcast.emit(IoChatEvent.USER_OFFLINE, "user left");
		});
	});
}
