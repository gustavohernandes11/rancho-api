import {
	IBatchModel,
	ICheckAccountByIdRepository,
	IDbListBatches,
	IListBatchesByOwnerIdRepository,
} from "./db-list-batches-protocols";

export class DbListBatches implements IDbListBatches {
	constructor(
		private readonly checkAccountByIdRepository: ICheckAccountByIdRepository,
		private readonly listBatchesByOwnerIdRepository: IListBatchesByOwnerIdRepository
	) {}
	async listBatches(ownerId: string): Promise<IBatchModel[] | null> {
		const isValidAccount = await this.checkAccountByIdRepository.checkById(
			ownerId
		);
		if (isValidAccount) {
			return await this.listBatchesByOwnerIdRepository.listBatches(
				ownerId
			);
		}
		return null;
	}
}
