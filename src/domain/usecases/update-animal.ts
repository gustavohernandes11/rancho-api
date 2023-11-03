import { IAnimalModel } from "@domain/models/animals";

export interface IDbUpdateAnimal {
	update: (
		id: string,
		props: IUpdateAnimalModel
	) => Promise<IAnimalModel | null>;
}

export interface IUpdateAnimalModel {
	ownerId?: string;
	name?: string;
	maternityId?: string;
	paternityId?: string;
	age?: Date;
	code?: number;
	observation?: string;
}
