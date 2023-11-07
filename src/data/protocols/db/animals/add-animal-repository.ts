import { IAddAnimalModel } from "@domain/usecases/add-animal";

export interface IAddAnimalRepository {
	addAnimal(account: IAddAnimalModel): Promise<boolean>;
}
