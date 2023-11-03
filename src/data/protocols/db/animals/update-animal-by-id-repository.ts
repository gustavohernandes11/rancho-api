import { IUpdateAnimalModel } from "@domain/usecases/update-animal";

export interface IUpdateAnimalByIdRepository {
	updateAnimal(id: string, props: IUpdateAnimalModel): Promise<boolean>;
}
