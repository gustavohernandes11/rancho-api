import {
	ICheckBatchByIdRepository,
	IDbRemoveBatch,
	IListAnimalsByBatchRepository,
	IRemoveBatchByIdRepository,
	IUpdateAnimalByIdRepository,
} from "./db-remove-batch-protocols";

export class DbRemoveBatch implements IDbRemoveBatch {
	constructor(
		private readonly removeBatchByIdRepository: IRemoveBatchByIdRepository,
		private readonly checkBatchByIdRepository: ICheckBatchByIdRepository,
		private readonly updateAnimalByIdRepository: IUpdateAnimalByIdRepository,
		private readonly listAnimalsByBatchRepository: IListAnimalsByBatchRepository
	) {}
	async remove(batchId: string): Promise<boolean> {
		const isValid = await this.checkBatchByIdRepository.checkById(batchId);
		if (isValid) {
			const success = await this.removeBatchByIdRepository.removeBatch(
				batchId
			);
			if (success) {
				const animalsToRemoveBatch =
					await this.listAnimalsByBatchRepository.listByBatch(
						batchId
					);

				animalsToRemoveBatch?.map((animal) => {
					this.updateAnimalByIdRepository.updateAnimal(animal.id, {
						batchId: null,
					});
				});
			}
			return success;
		}
		return false;
	}
}
