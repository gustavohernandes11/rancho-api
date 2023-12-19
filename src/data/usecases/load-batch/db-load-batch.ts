import {
	IBatchInfo,
	IDbLoadBatch,
	ILoadBatchByIdRepository,
} from "./db-load-batch-protocols";

export class DbLoadBatch implements IDbLoadBatch {
	constructor(
		private readonly loadBatchByIdRepository: ILoadBatchByIdRepository
	) {}
	async load(id: string): Promise<IBatchInfo | null> {
		return await this.loadBatchByIdRepository.loadBatch(id);
	}
}
