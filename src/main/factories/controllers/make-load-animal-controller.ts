import { AnimalMongoRepository } from "@infra/db/mongodb/animal-mongo-repository";
import { IController } from "@presentation/protocols";
import { LoadAnimalController } from "@presentation/controllers/animals/load-animal-controller";
import { DbLoadAnimal } from "@data/usecases/load-animal/db-load-animal";

export const makeLoadAnimalController = (): IController => {
	const animalMongoRepository = new AnimalMongoRepository();
	const dbLoadAnimal = new DbLoadAnimal(animalMongoRepository);
	return new LoadAnimalController(dbLoadAnimal);
};
