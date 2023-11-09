import { DbListBatches } from "@data/usecases/list-batches/db-list-batches";
import { AccountMongoRepository } from "@infra/db/mongodb/account-mongo-repository";
import { BatchMongoRepository } from "@infra/db/mongodb/batch-mongo-repository";
import { ListBatchesController } from "@presentation/controllers/batch/list-batches-controller";
import { IController } from "@presentation/protocols";

export const makeListBatchesController = (): IController => {
	const accountMongoRepoisitory = new AccountMongoRepository();
	const batchMongoRepository = new BatchMongoRepository();
	const dbListBatches = new DbListBatches(
		accountMongoRepoisitory,
		batchMongoRepository
	);
	return new ListBatchesController(dbListBatches);
};
