import { IBatchModel } from "@/domain/models/batch";
import { IUpdateBatchModel } from "@/domain/usecases/update-batch";

export interface IUpdateBatchByIdRepository {
	updateBatch(
		id: string,
		props: IUpdateBatchModel
	): Promise<IBatchModel | null>;
}
