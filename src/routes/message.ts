import Fastify, { FastifyReply, FastifyRequest } from "fastify";

interface Message {
	id: string;
	content: string;
	sender: string;
	timestamp: Date;
}

const messages: Message[] = [];
export default async function messageRoutes() {
	const fastify = Fastify();

	fastify.get(
		"/messages",
		async (request: FastifyRequest, reply: FastifyReply) => {
			return messages;
		}
	);

	fastify.post(
		"/messages",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { content, sender } = request.body as {
				content: string;
				sender: string;
			};
			const newMessage: Message = {
				id: (messages.length + 1).toString(),
				content,
				sender,
				timestamp: new Date(),
			};
			messages.push(newMessage);
			reply.code(201).send(newMessage);
		}
	);

	fastify.get(
		"/messages/:id",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { id } = request.params as { id: string };
			const message = messages.find((msg) => msg.id === id);
			if (!message) {
				reply.code(404).send({ message: "Message not found" });
			} else {
				reply.send(message);
			}
		}
	);

	fastify.delete(
		"/messages/:id",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { id } = request.params as { id: string };
			const index = messages.findIndex((msg) => msg.id === id);
			if (index === -1) {
				reply.code(404).send({ message: "Message not found" });
			} else {
				messages.splice(index, 1);
				reply.code(204).send();
			}
		}
	);
}
