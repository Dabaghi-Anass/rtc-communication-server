import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { AttachmentMediaType, MessageType } from "../types/chat";
//message entity

export const MessageSchema = new mongoose.Schema({
	id: { type: String, default: randomUUID() },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	attachements: [
		{
			url: String,
			mediaType: {
				type: String,
				enum: Object.values(AttachmentMediaType),
				required: true,
			},
		},
	],
	content: { type: String, required: true },
	sender: { type: String, required: true },
	destination: { type: String, required: true },
	type: {
		type: String,
		enum: Object.values(MessageType),
		default: "text",
	},
});

export const MessageModel = mongoose.model("Message", MessageSchema);
