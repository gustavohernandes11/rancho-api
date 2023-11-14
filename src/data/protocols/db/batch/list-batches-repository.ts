import { IBatchModel } from "@/domain/models/batch";

export interface IListBatchesByOwnerIdRepository {
	listBatches(ownerId: string): Promise<IBatchModel[]>;
}
