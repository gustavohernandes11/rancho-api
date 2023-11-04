import { IAnimalModel } from "@domain/models/animals";

export interface IDbListAnimals {
	load(accountId: string): Promise<IAnimalModel[] | null>;
}
