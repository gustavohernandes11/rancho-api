import { IAnimalModel } from "@/domain/models/animals";
import { IUpdateAnimalModel } from "../models/update-animal";

export type IUpdateAnimalWithId = IUpdateAnimalModel & { id: string };

export interface IDbUpdateManyAnimals {
	updateMany: (
		animals: IUpdateAnimalWithId[]
	) => Promise<(IAnimalModel | null)[]>;
}
