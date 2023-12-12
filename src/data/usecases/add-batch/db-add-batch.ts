import { ICheckBatchByNameRepository } from "@/data/protocols/db/batch/check-batch-by-name-repository";
import {
	IAddBatchModel,
	ICheckAccountByIdRepository,
	IAddBatchRepository,
	IDbAddBatch,
} from "./db-add-batch-protocols";

export class DbAddBatch implements IDbAddBatch {
	constructor(
		private readonly checkAccountByIdRepository: ICheckAccountByIdRepository,
		private readonly addBatchRepository: IAddBatchRepository,
		private readonly checkBatchByNameRepository: ICheckBatchByNameRepository
	) {}

	async add(batch: IAddBatchModel): Promise<boolean> {
		const isValidOwner = await this.checkAccountByIdRepository.checkById(
			batch.ownerId
		);
		const alreadyInUseName =
			await this.checkBatchByNameRepository.checkByName(
				batch.name,
				batch.ownerId
			);

		if (isValidOwner && !alreadyInUseName) {
			return await this.addBatchRepository.addBatch(batch);
		}
		return false;
	}
}
