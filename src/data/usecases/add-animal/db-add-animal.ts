import { ICheckAnimalByIdRepository } from "@/data/protocols/db/animals/check-animal-by-id-repository";
import {
	IDbAddAnimal,
	IAddAnimalModel,
	IAddAnimalRepository,
	ICheckAccountByIdRepository,
} from "./db-add-animal-protocols";

export class DbAddAnimal implements IDbAddAnimal {
	constructor(
		private readonly checkAccountById: ICheckAccountByIdRepository,
		private readonly checkAnimalById: ICheckAnimalByIdRepository,
		private readonly addAnimalRepository: IAddAnimalRepository
	) {}

	async add(animal: IAddAnimalModel): Promise<boolean> {
		const isValidOwner = await this.checkAccountById.checkById(
			animal.ownerId
		);
		if (animal.paternityId) {
			const isValidPaternity = await this.checkAnimalById.checkById(
				animal.paternityId
			);
			if (!isValidPaternity) {
				return false;
			}
		}
		if (animal.maternityId) {
			const isValidMaternity = await this.checkAnimalById.checkById(
				animal.maternityId
			);
			if (!isValidMaternity) {
				return false;
			}
		}
		if (isValidOwner) {
			return await this.addAnimalRepository.addAnimal(animal);
		}
		return false;
	}
}
