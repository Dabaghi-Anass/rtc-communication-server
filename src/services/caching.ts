import { Redis } from "ioredis";
import { ICachingService } from "../types/services";

/**
 * Caching service
 * @class CachingService
 */
export class CachingService implements ICachingService {
	private cachingClient: Redis;
	constructor(cachingClient) {
		this.cachingClient = cachingClient;
		this.cachingClient.connect();
	}
	get(key: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.cachingClient.get(key, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	}
	set(key: string, value: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.cachingClient.set(key, value, (err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}
	del(key: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.cachingClient.del(key, (err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}
	keys(): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.cachingClient.keys("*", (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	}
	keysRegex(pattern: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.cachingClient.keys(pattern, (err, result) => {
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});
	}

	flush(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.cachingClient.flushall((err) => {
				if (err) {
					reject(err);
				}
				resolve();
			});
		});
	}
}
