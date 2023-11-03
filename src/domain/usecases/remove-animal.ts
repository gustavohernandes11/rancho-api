export interface IDbRemoveAnimal {
	remove(id: string): Promise<boolean>;
}
