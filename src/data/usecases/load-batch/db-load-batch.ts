import { IDbLoadBatch } from "@/domain/usecases/load-batch";
import { IBatchModel } from "../list-batches/db-list-batches-protocols";
import { ILoadBatchByIdRepository } from "@/data/protocols/db/batch/load-batch-by-id-repository";
import { IBatchInfo } from "@/domain/models/batch-info";

export class DbLoadBatch implements IDbLoadBatch {
	constructor(
		private readonly loadBatchByIdRepository: ILoadBatchByIdRepository
	) {}
	async load(id: string): Promise<IBatchInfo | null> {
		return await this.loadBatchByIdRepository.loadBatch(id);
	}
}
