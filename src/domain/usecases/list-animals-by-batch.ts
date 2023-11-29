import { IAnimalModel } from "@/domain/models/animals";

export interface IDbListAnimalsByBatch {
	list: (batchId: string) => Promise<IAnimalModel[] | null>;
}
