export interface IDbAddAnimal {
	add: (animal: IAddAnimalModel) => Promise<boolean>;
}

export interface IAddAnimalModel {
	ownerId: string;
	name?: string;
	maternityId?: string;
	paternityId?: string;
	age?: Date;
	birthdayDate?: Date;
	code?: number;
	observation?: string;
}
