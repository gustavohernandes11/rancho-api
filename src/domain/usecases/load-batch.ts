import { IBatchInfo } from "../models/batch-info";

export interface IDbLoadBatch {
	load(id: string): Promise<IBatchInfo | null>;
}
