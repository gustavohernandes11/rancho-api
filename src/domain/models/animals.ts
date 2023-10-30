export interface IAnimalModel {
	id: string;
	ownerId: string;
	age: Date;
	name?: string;
	maternityId?: string;
	paternityId?: string;
	code?: number;
	observation?: string;
}
