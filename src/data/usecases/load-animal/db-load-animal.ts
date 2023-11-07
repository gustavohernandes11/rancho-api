import { ILoadAnimalByIdRepository } from "@data/protocols/db/animals/load-animal-by-id-repository";
import { IDbLoadAnimal } from "@domain/usecases/load-animal";
import { IAnimalModel } from "@domain/models/animals";

export class DbLoadAnimal implements IDbLoadAnimal {
	constructor(
		private readonly loadAnimalByIdRepository: ILoadAnimalByIdRepository
	) {}
	async load(id: string): Promise<IAnimalModel | null> {
		return await this.loadAnimalByIdRepository.loadAnimal(id);
	}
}
