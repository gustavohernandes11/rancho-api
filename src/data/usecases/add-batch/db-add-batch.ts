import {
	IAddBatchModel,
	ICheckAccountByIdRepository,
	IAddBatchRepository,
	IDbAddBatch,
} from "./db-add-batch-protocols";

export class DbAddBatch implements IDbAddBatch {
	constructor(
		private readonly checkAccountByIdRepository: ICheckAccountByIdRepository,
		private readonly addBatchRepository: IAddBatchRepository
	) {}

	async add(batch: IAddBatchModel): Promise<boolean> {
		const isValidOwner = await this.checkAccountByIdRepository.checkById(
			batch.ownerId
		);
		if (isValidOwner) {
			return await this.addBatchRepository.addBatch(batch);
		}
		return false;
	}
}
