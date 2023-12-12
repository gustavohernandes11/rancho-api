import { IBatchInfo } from "@/domain/models/batch-info";

export interface ILoadBatchByIdRepository {
	loadBatch(id: string): Promise<IBatchInfo | null>;
}
