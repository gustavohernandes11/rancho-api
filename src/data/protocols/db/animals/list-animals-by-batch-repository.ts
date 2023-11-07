import { IAnimalModel } from "@domain/models/animals";

export interface IListAnimalsByBatchRepository {
	listByBatch(batchId: string): Promise<IAnimalModel[] | null>;
}
