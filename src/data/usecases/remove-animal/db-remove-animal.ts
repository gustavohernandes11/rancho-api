import {
	IDbRemoveAnimal,
	IRemoveAnimalByIdRepository,
} from "./db-remove-animal-protocols";

export class DbRemoveAnimal implements IDbRemoveAnimal {
	constructor(
		private readonly removeAnimalByIdRepository: IRemoveAnimalByIdRepository
	) {}

	async remove(id: string): Promise<boolean> {
		return await this.removeAnimalByIdRepository.removeAnimal(id);
	}
}
