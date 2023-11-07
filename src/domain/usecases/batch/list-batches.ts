import { IBatchModel } from "@domain/models/batch";

export interface IDbAddBatch {
	listBatches: (ownerId: string) => Promise<IBatchModel[] | null>;
}
