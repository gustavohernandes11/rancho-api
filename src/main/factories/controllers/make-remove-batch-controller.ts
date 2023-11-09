import { DbRemoveBatch } from "@data/usecases/remove-batch/db-remove-batch";
import { AnimalMongoRepository } from "@infra/db/mongodb/animal-mongo-repository";
import { BatchMongoRepository } from "@infra/db/mongodb/batch-mongo-repository";
import { RemoveBatchController } from "@presentation/controllers/batch/remove-batch-controller";
import { IController } from "@presentation/protocols";

export const makeRemoveBatchController = (): IController => {
	const animalMongoRepository = new AnimalMongoRepository();
	const batchMongoRepository = new BatchMongoRepository();
	const dbRemoveBatch = new DbRemoveBatch(
		batchMongoRepository,
		batchMongoRepository,
		animalMongoRepository,
		animalMongoRepository
	);

	return new RemoveBatchController(dbRemoveBatch);
};
