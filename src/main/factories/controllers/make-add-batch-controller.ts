import { AccountMongoRepository } from "@/infra/db/mongodb/account-mongo-repository";
import { IController } from "@/presentation/protocols";
import { AddBatchController } from "@/presentation/controllers/batch/add-batch-controller";
import { DbAddBatch } from "@/data/usecases/add-batch/db-add-batch";
import { BatchMongoRepository } from "@/infra/db/mongodb/batch-mongo-repository";
import { makeAddBatchValidations } from "../validation/make-add-batch-validations";

export const makeAddBatchController = (): IController => {
	const validations = makeAddBatchValidations();
	const accountMongoRepoisitory = new AccountMongoRepository();
	const batchMongoRepository = new BatchMongoRepository();

	const dbAddBatch = new DbAddBatch(
		accountMongoRepoisitory,
		batchMongoRepository,
		batchMongoRepository
	);

	return new AddBatchController(validations, dbAddBatch);
};
