export interface IDbAddBatch {
	add: (batch: IAddBatchModel) => Promise<boolean>;
}

export interface IAddBatchModel {
	ownerId: string;
	name: string;
}
