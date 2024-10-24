import mongoose from "mongoose";
import { MessageAttachement, MessageType } from "../types/chat";
//message entity

export const MessageSchema = new mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	attachements: [MessageAttachement],
	content: { type: String, required: true },
	sender: { type: String, required: true },
	destination: { type: String, required: true },
	type: { type: MessageType, default: MessageType.TEXT },
});

export const MessageModel = mongoose.model("Message", MessageSchema);
