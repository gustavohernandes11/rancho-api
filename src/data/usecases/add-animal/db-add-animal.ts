import {
	IAddAnimal,
	IAddAnimalModel,
	IAddAnimalRepository,
	ICheckAccountByIdRepository,
} from "./db-add-animal-protocols";

export class DbAddAnimal implements IAddAnimal {
	constructor(
		private readonly checkAccountById: ICheckAccountByIdRepository,
		private readonly addAnimalRepository: IAddAnimalRepository
	) {}

	async add(animal: IAddAnimalModel): Promise<boolean> {
		const isValidOwner = await this.checkAccountById.checkById(
			animal.ownerId
		);
		if (isValidOwner) {
			return await this.addAnimalRepository.addAnimal(animal);
		}
		return false;
	}
}
