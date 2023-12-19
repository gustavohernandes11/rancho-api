import {
	IAnimalModel,
	IDbLoadAnimal,
	ILoadAnimalByIdRepository,
} from "./db-load-animal-protocols";

export class DbLoadAnimal implements IDbLoadAnimal {
	constructor(
		private readonly loadAnimalByIdRepository: ILoadAnimalByIdRepository
	) {}
	async load(id: string): Promise<IAnimalModel | null> {
		return await this.loadAnimalByIdRepository.loadAnimal(id);
	}
}
