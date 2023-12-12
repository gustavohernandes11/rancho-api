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
