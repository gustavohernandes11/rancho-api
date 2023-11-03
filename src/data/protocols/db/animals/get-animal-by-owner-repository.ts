import { IAnimalModel } from "@domain/models/animals";

export interface IGetAnimalByOwnerIdRepository {
	getAnimal(ownerId: string): Promise<IAnimalModel>;
}
