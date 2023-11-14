import { ObjectId } from "mongodb";

export interface IRemoveBatchByIdRepository {
	removeBatch(batchId: ObjectId | string): Promise<boolean>;
}
