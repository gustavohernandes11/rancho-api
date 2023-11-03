import { IAnimalModel } from "@domain/models/animals";

export interface IListAnimalsByOwnerId {
	listAnimals(ownerId: string): Promise<IAnimalModel[]>;
}
