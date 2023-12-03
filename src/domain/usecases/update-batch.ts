export interface IDbUpdateBatch {
	update: (batchId: string, props: IUpdateBatchModel) => Promise<boolean>;
}

export interface IUpdateBatchModel {
	ownerId?: string;
	name?: string;
	observation?: string;
}
