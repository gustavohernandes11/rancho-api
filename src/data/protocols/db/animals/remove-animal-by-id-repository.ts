import { ObjectId } from "mongodb";

export interface IRemoveAnimalByIdRepository {
	removeAnimal(animalId: ObjectId | string): Promise<boolean>;
}
