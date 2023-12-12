import {
	IDbUpdateManyAnimals,
	IUpdateManyAnimalsProps,
} from "@/domain/usecases/update-many-animals";
import {
	IAnimalModel,
	IUpdateAnimalByIdRepository,
} from "./db-update-many-animals-protocols";

export class DbUpdateManyAnimals implements IDbUpdateManyAnimals {
	constructor(
		private readonly updateAnimalRepository: IUpdateAnimalByIdRepository
	) {}
	async updateMany(
		animals: IUpdateManyAnimalsProps[]
	): Promise<(IAnimalModel | null)[]> {
		const updatePromises = animals.map((animal) =>
			this.updateAnimalRepository.updateAnimal(animal.id, animal.props)
		);
		return Promise.all(updatePromises);
	}
}
