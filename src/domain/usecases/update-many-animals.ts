import { IAnimalModel } from "@/domain/models/animals";
import { IUpdateAnimalModel } from "../models/update-animal";

export type IUpdateManyAnimalsProps = {
	id: string;
	props: IUpdateAnimalModel;
};

export interface IDbUpdateManyAnimals {
	updateMany: (
		animals: IUpdateManyAnimalsProps[]
	) => Promise<(IAnimalModel | null)[]>;
}
