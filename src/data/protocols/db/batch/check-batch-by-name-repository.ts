export interface ICheckBatchByNameRepository {
	checkByName(name: string): Promise<boolean>;
}
