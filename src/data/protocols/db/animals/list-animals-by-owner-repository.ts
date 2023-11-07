import { IAnimalModel } from "@domain/models/animals";

export interface IListAnimalsByOwnerIdRepository {
	listAnimals(ownerId: string): Promise<IAnimalModel[]>;
}
