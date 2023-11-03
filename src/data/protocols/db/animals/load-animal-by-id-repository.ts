import { IAnimalModel } from "@domain/models/animals";

export interface ILoadAnimalByIdRepository {
	loadAnimal(id: string): Promise<IAnimalModel | null>;
}
