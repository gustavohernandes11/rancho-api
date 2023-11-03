export interface IUpdateAnimalByIdRepository {
	updateAnimal(id: string): Promise<boolean>;
}
