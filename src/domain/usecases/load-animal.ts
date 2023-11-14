import { IAnimalModel } from "@/domain/models/animals";

export interface IDbLoadAnimal {
	load(id: string): Promise<IAnimalModel | null>;
}
