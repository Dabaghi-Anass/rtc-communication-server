export enum RedisChannels {
	USER_OFFLINE_CHANNEL = "chat:user-offline",
	USER_ONLINE_CHANNEL = "chat:user-online",
	USER_TYPING_CHANNEL = "chat:user-typing",
	USER_TYPING_STOP_CHANNEL = "chat:user-typing-stop",
	MESSAGE_READ_CHANNEL = "chat:message-read",
	MESSAGE_DELIVERED_CHANNEL = "chat:message-delivered",
	MESSAGE_DELETED_CHANNEL = "chat:message-deleted",
	MESSAGE_UPDATED_CHANNEL = "chat:message-updated",
	MESSAGE_CREATED_CHANNEL = "chat:message-created",
	MESSAGE_REACTION_CHANNEL = "chat:message-reaction",
}
