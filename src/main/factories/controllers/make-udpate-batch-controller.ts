import { UpdateBatchController } from "@presentation/controllers/batch/update-batch-controller";
import { IController } from "@presentation/protocols";
import { makeUpdateBatchValidations } from "../validation/make-update-batch-validations";
import { DbUpdateBatch } from "@data/usecases/update-batch/db-update-batch";
import { BatchMongoRepository } from "@infra/db/mongodb/batch-mongo-repository";

export const makeUpdateBatchController = (): IController => {
	const validations = makeUpdateBatchValidations();
	const batchMongoRepository = new BatchMongoRepository();
	const dbUpdateBatch = new DbUpdateBatch(batchMongoRepository);
	return new UpdateBatchController(validations, dbUpdateBatch);
};
