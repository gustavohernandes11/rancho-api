import { IBatchModel } from "@/domain/models/batch";

export interface IDbListBatches {
	listBatches: (ownerId: string) => Promise<IBatchModel[] | null>;
}
