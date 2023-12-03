export interface IAnimalModel {
	id: string;
	ownerId: string;
	age: string;
	gender: "F" | "M";
	batchId?: string;
	name?: string;
	maternityId?: string;
	paternityId?: string;
	code?: number;
	observation?: string;
}
