import { IAnimalModel } from "@/domain/models/animals";

export interface IDbUpdateAnimal {
	update: (
		id: string,
		props: IUpdateAnimalModel
	) => Promise<IAnimalModel | null>;
}

export interface IUpdateAnimalModel {
	ownerId?: string;
	batchId?: string | null;
	gender?: "F" | "M";
	name?: string;
	maternityId?: string;
	paternityId?: string;
	age?: string;
	code?: number;
	observation?: string;
}
