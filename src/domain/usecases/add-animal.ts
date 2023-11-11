export interface IDbAddAnimal {
	add: (animal: IAddAnimalModel) => Promise<boolean>;
}

export interface IAddAnimalModel {
	ownerId: string;
	age: string;
	name?: string;
	maternityId?: string;
	paternityId?: string;
	code?: number;
	observation?: string;
}
