export enum MessageType {
	TEXT = "text",
	IMAGE = "image",
	VIDEO = "video",
	AUDIO = "audio",
	LOCATION = "location",
	CONTACT = "contact",
	STICKER = "sticker",
	FILE = "file",
	SYSTEM = "system",
}

export enum AttachmentMediaType {
	IMAGE = "image",
	VIDEO = "video",
	AUDIO = "audio",
	FILE = "file",
}

export class MessageAttachement {
	mediaType: AttachmentMediaType;
	url: string;

	constructor(mediaType: AttachmentMediaType, url: string) {
		this.mediaType = mediaType;
		this.url = url;
	}
}
