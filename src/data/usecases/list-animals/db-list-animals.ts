import {
	IAnimalModel,
	ICheckAccountByIdRepository,
	IDbListAnimals,
	IListAnimalsByOwnerIdRepository,
} from "./db-list-animals-protocols";

export class DbListAnimals implements IDbListAnimals {
	constructor(
		private readonly listAnimalsByOwnerIdRepository: IListAnimalsByOwnerIdRepository,
		private readonly checkAccountByIdRepository: ICheckAccountByIdRepository
	) {}
	async list(accountId: string): Promise<IAnimalModel[] | null> {
		const isValid = await this.checkAccountByIdRepository.checkById(
			accountId
		);

		if (isValid) {
			return await this.listAnimalsByOwnerIdRepository.listAnimals(
				accountId
			);
		}

		return null;
	}
}
