export interface IDbRemoveBatch {
	remove: (batchId: string) => Promise<boolean>;
}
