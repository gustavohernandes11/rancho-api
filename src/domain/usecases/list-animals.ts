import { IAnimalModel } from "@domain/models/animals";

export interface IDbListAnimals {
	list(accountId: string): Promise<IAnimalModel[] | null>;
}
