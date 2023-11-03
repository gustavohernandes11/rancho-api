export interface IUpdateAnimal {
	update: (animal: IUpdateAnimalModel) => Promise<boolean>;
}

export interface IUpdateAnimalModel {
	ownerId?: string;
	name?: string;
	maternityId?: string;
	paternityId?: string;
	age?: Date;
	birthdayDate?: Date;
	code?: number;
	observation?: string;
}
