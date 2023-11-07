export interface ICheckAccountByIdRepository {
	checkById(id: string): Promise<boolean>;
}
