import { IAddBatchModel } from "@/domain/usecases/batch/add-batch";

export interface IAddBatchRepository {
	addBatch(batch: IAddBatchModel): Promise<boolean>;
}
