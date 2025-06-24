import mongoose from "mongoose";
import { ActionAfterExpiration } from "../types/utils";
import { BaseSchema } from "./base-schema";

//message entity
const PollSchema = new mongoose.Schema({
	...BaseSchema,
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
		type: {
			type: String,
			enum: Object.values(ActionAfterExpiration),
		},
		target: String,
	},
});

export const PollModel = mongoose.model("Poll", PollSchema);
