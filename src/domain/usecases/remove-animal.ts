export interface IDbRemoveAnimal {
	remove(id: string, ownerId: string): Promise<boolean>;
}
