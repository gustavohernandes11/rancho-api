import { DbListAnimalsByBatch } from "@/data/usecases/list-animals-by-batch/db-list-animals-by-batch";
import { AnimalMongoRepository } from "@/infra/db/mongodb/animal-mongo-repository";
import { BatchMongoRepository } from "@/infra/db/mongodb/batch-mongo-repository";
import { LoadBatchController } from "@/presentation/controllers/batch/load-batch-controller";
import { IController } from "@/presentation/protocols";

export const makeLoadBatchController = (): IController => {
	const animalMongoRepository = new AnimalMongoRepository();
	const batchMongoRepository = new BatchMongoRepository();

	const dbLoadBatch = new DbListAnimalsByBatch(
		batchMongoRepository,
		animalMongoRepository
	);

	return new LoadBatchController(dbLoadBatch);
};
