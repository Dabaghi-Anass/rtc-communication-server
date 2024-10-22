export interface ICachingService {
	get(key: string): Promise<string>;
	set(key: string, value: string): Promise<void>;
	del(key: string): Promise<void>;
	keys(): Promise<string[]>;
	flush(): Promise<void>;
}
