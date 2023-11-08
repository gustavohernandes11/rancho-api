import {
	ICheckBatchByIdRepository,
	IDbRemoveBatch,
	IRemoveBatchByIdRepository,
} from "./db-remove-batch-protocols";

export class DbRemoveBatch implements IDbRemoveBatch {
	constructor(
		private readonly removeBatchByIdRepository: IRemoveBatchByIdRepository,
		private readonly checkBatchByIdRepository: ICheckBatchByIdRepository
	) {}
	async remove(batchId: string): Promise<boolean> {
		const isValid = await this.checkBatchByIdRepository.checkById(batchId);
		if (isValid) {
			const success = await this.removeBatchByIdRepository.removeBatch(
				batchId
			);
			return success;
		}
		return false;
	}
}
