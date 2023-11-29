export interface IDbAddBatch {
	add: (batch: IAddBatchModel) => Promise<boolean>;
}

export interface IAddBatchModel {
	name: string;
	observation?: string;
	ownerId: string;
}
