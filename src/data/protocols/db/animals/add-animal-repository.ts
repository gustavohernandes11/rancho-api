import { IAddAnimalModel } from "../../../../domain/usecases/add-animal";

export interface IAddAnimalRepository {
	add(account: IAddAnimalModel): Promise<boolean>;
}
