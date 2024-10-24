import mongoose from "mongoose";
import { MessageSchema } from "./message";

enum ActionAfterExpiration {
	BAN_USER = "ban user",
	DELETE_MESSAGE = "delete message",
	TIMEOUT_USER = "timeout user",
}

type PollActionTarget = {};
//message entity
const PollMessageSchema = new mongoose.Schema({
	...MessageSchema.obj,
	options: [{ type: String, required: true }],
	voters: [
		{
			type: {
				userId: { type: String, required: true },
				option: { type: String, required: true },
			},

			required: true,
		},
	],

	expirationDate: { type: Date, required: true },
	targetType: { type: String, required: true },
	actionAfterExpiration: {
		type: ActionAfterExpiration,
		// target: PollActionTarget,
		required: true,
	},
});

export const PollMessageModel = mongoose.model("Message", PollMessageSchema);
