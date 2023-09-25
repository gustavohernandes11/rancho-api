import { MongoClient, Collection } from "mongodb";

export const MongoHelper = {
	url: null as unknown as string,
	client: null as unknown as MongoClient | null,

	async connect(url: string): Promise<void> {
		this.client = await MongoClient.connect(url);
	},
	async disconnect(): Promise<void> {
		await this.client?.close();
		this.client = null;
	},
	getCollection(name: string): Collection | undefined {
		return this.client?.db().collection(name);
	},
	map(data: any): any {
		const { _id, rest } = data;
		return { ...rest, id: _id.toHexString() };
	},
	mapCollection(collection: any[]): any[] {
		return collection.map((c) => MongoHelper.map(c));
	},
};
