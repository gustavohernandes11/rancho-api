import { DbAddAnimal } from "@data/usecases/add-animal/db-add-animal";
import { AccountMongoRepository } from "@infra/db/mongodb/account-mongo-repository";
import { AnimalMongoRepository } from "@infra/db/mongodb/animal-mongo-repository";
import { AddAnimalController } from "@presentation/controllers/animals/add-animal-controller";
import { IController } from "@presentation/protocols";
import { makeAddAnimalValidations } from "../validation/make-add-animal-validations";

export const makeAddAnimalController = (): IController => {
	const validations = makeAddAnimalValidations();
	const accountMongoRepoisitory = new AccountMongoRepository();
	const animalMongoRepository = new AnimalMongoRepository();
	const dbAddAnimal = new DbAddAnimal(
		accountMongoRepoisitory,
		animalMongoRepository
	);

	return new AddAnimalController(validations, dbAddAnimal);
};
