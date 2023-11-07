export interface ICheckBatchByIdRepository {
	checkById(id: string): Promise<boolean>;
}
