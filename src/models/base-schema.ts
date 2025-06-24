import { randomUUID } from "crypto";

export const BaseSchema = {
	id: { type: String, default: randomUUID() },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
};
