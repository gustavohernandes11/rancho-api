export interface ICheckAnimalByIdRepository {
	checkById(id: string): Promise<boolean>;
}
