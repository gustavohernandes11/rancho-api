import { DbLoadBatch } from "@/data/usecases/load-batch/db-load-batch";
import { BatchMongoRepository } from "@/infra/db/mongodb/batch-mongo-repository";
import { LoadBatchController } from "@/presentation/controllers/batch/load-batch-controller";
import { IController } from "@/presentation/protocols";

export const makeLoadBatchController = (): IController => {
	const batchMongoRepository = new BatchMongoRepository();
	const dbLoadBatch = new DbLoadBatch(batchMongoRepository);

	return new LoadBatchController(dbLoadBatch);
};
