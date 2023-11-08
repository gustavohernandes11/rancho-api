import { IBatchModel } from "@domain/models/batch";
import { IUpdateBatchModel } from "@domain/usecases/batch/update-batch";

export interface IUpdateBatchByIdRepository {
	updateBatch(
		id: string,
		props: IUpdateBatchModel
	): Promise<IBatchModel | null>;
}
