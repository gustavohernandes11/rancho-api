import { ILoadAnimalByIdRepository } from "../load-animal/db-load-animal-protocols";
import {
	IDbRemoveAnimal,
	IRemoveAnimalByIdRepository,
} from "./db-remove-animal-protocols";

export class DbRemoveAnimal implements IDbRemoveAnimal {
	constructor(
		private readonly removeAnimalByIdRepository: IRemoveAnimalByIdRepository,
		private readonly loadAnimalByIdRepository: ILoadAnimalByIdRepository
	) {}

	async remove(id: string, ownerId: string): Promise<boolean> {
		const animal = await this.loadAnimalByIdRepository.loadAnimal(id);

		if (animal && animal.ownerId === ownerId) {
			return await this.removeAnimalByIdRepository.removeAnimal(id);
		}

		return false;
	}
}
