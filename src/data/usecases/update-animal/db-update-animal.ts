import {
	IAnimalModel,
	IDbUpdateAnimal,
	IUpdateAnimalByIdRepository,
	IUpdateAnimalModel,
} from "./db-update-animal-protocols";

export class DbUpdateAnimal implements IDbUpdateAnimal {
	constructor(
		private readonly updateAnimalRepository: IUpdateAnimalByIdRepository
	) {}
	async update(
		id: string,
		animal: IUpdateAnimalModel
	): Promise<IAnimalModel | null> {
		const updated = await this.updateAnimalRepository.updateAnimal(
			id,
			animal
		);
		return updated;
	}
}
