import mongoose from "mongoose";
import { AttachmentMediaType, MessageType } from "../types/chat";
import { BaseSchema } from "./base-schema";
//message entity

export const MessageSchema = new mongoose.Schema({
	...BaseSchema,
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
	pollId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Poll",
	},
});

export const MessageModel = mongoose.model("Message", MessageSchema);
