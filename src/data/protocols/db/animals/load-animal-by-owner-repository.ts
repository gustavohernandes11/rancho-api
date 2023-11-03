import { IAnimalModel } from "@domain/models/animals";

export interface ILoadAnimalByOwnerIdRepository {
	loadAnimal(ownerId: string): Promise<IAnimalModel | null>;
}
