import { AnimalMongoRepository } from "@infra/db/mongodb/animal-mongo-repository";
import { IController } from "@presentation/protocols";
import { RemoveAnimalController } from "@presentation/controllers/animals/remove-animal-controller";
import { DbRemoveAnimal } from "@data/usecases/remove-animal/db-remove-animal";
import { makeRemoveAnimalValidations } from "../validation/make-remove-animal-validations";
import { DbLoadAnimal } from "@data/usecases/load-animal/db-load-animal";

export const makeRemoveAnimalController = (): IController => {
	const validations = makeRemoveAnimalValidations();
	const animalMongoRepository = new AnimalMongoRepository();
	const dbRemoveAnimal = new DbRemoveAnimal(
		animalMongoRepository,
		animalMongoRepository
	);
	const dbLoadAnimal = new DbLoadAnimal(animalMongoRepository);
	return new RemoveAnimalController(
		validations,
		dbRemoveAnimal,
		dbLoadAnimal
	);
};
