import {
	IAnimalModel,
	ICheckBatchByIdRepository,
	IDbListAnimalsByBatch,
	IListAnimalsByBatchRepository,
} from "./db-list-animals-by-batch-protocols";

export class DbListAnimalsByBatch implements IDbListAnimalsByBatch {
	constructor(
		private readonly checkBatchByIdRepository: ICheckBatchByIdRepository,
		private readonly listAnimalsByBathRepository: IListAnimalsByBatchRepository
	) {}
	async list(batchId: string): Promise<IAnimalModel[] | null> {
		const batchExists = await this.checkBatchByIdRepository.checkById(
			batchId
		);

		if (batchExists) {
			return await this.listAnimalsByBathRepository.listByBatch(batchId);
		}

		return null;
	}
}
