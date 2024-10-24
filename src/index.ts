import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import Fastify from "fastify";
import { Server } from "socket.io";
import { connectDatabase } from "./connections/mongodb";
import { handleSocketConnections } from "./controllers/websocket.io";
import { MessageModel } from "./models/message";
import { AttachmentMediaType, MessageType } from "./types/chat";
import { getLogger } from "./utils/logger";
dotenv.config();

const port: number = parseInt(process.env.PORT || "3000");

// const cachingService: ICachingService = new CachingService();

const app = Fastify();

app.register(fastifyCors, {
	origin: process.env.CORS_ORIGIN,
});

const io = new Server(app.server, {
	cors: {
		origin: process.env.CORS_ORIGIN,
	},
});

handleSocketConnections(io);
connectDatabase();

app.get("/create-message", async (request, reply) => {
	const message = await MessageModel.create({
		content: "Hello world",
		sender: "system",
		destination: "system",
		type: MessageType.TEXT,
		attachements: [
			{
				url: "https://example.com/image.jpg",
				mediaType: AttachmentMediaType.IMAGE,
			},
		],
	});

	return await message.save();
});

app.get("/messages", async (request, reply) => MessageModel.find());
app.get("/healthcheck", async (request, reply) => {
	return { status: "ok", port };
});

app.listen({ port }, async (err) => {
	const logger = await getLogger();
	logger.info(`Server listening at ${port}`);
	if (err) {
		logger.error(err.message);
		throw err;
	}
});
