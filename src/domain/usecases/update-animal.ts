import { IAnimalModel } from "@/domain/models/animals";
import { IUpdateAnimalModel } from "../models/update-animal";

export interface IDbUpdateAnimal {
	update: (
		id: string,
		props: IUpdateAnimalModel
	) => Promise<IAnimalModel | null>;
}
