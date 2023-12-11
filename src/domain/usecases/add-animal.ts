export interface IDbAddAnimal {
	add: (animal: IAddAnimalModel) => Promise<boolean>;
}

export interface IAddAnimalModel {
	ownerId: string;
	age: string;
	gender: "F" | "M";
	name?: string;
	maternityId?: string;
	batchId: string;
	paternityId?: string;
	code?: number;
	observation?: string;
}
