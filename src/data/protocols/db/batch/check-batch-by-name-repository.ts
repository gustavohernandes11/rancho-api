export interface ICheckBatchByNameRepository {
	checkByName(name: string, ownerId: string): Promise<boolean>;
}
