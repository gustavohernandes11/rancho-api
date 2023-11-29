import { IAddBatchModel } from "@/domain/usecases/add-batch";

export interface IAddBatchRepository {
	addBatch(batch: IAddBatchModel): Promise<boolean>;
}
