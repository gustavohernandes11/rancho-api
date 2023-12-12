import { DbListAnimalsByBatch } from "@/data/usecases/list-animals-by-batch/db-list-animals-by-batch";
import { AnimalMongoRepository } from "@/infra/db/mongodb/animal-mongo-repository";
import { BatchMongoRepository } from "@/infra/db/mongodb/batch-mongo-repository";
import { LoadBatchAnimalsController } from "@/presentation/controllers/batch/load-batch-animals-controller";
import { IController } from "@/presentation/protocols";

export const makeLoadBatchAnimalsController = (): IController => {
	const animalMongoRepository = new AnimalMongoRepository();
	const batchMongoRepository = new BatchMongoRepository();

	const dbLoadBatch = new DbListAnimalsByBatch(
		batchMongoRepository,
		animalMongoRepository
	);

	return new LoadBatchAnimalsController(dbLoadBatch);
};
