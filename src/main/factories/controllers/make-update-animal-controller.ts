import { IController } from "@presentation/protocols";
import { makeUpdateAnimalValidations } from "../validation/make-update-animal-validations";
import { UpdateAnimalController } from "@presentation/controllers/animals/update-animal-controller";
import { AnimalMongoRepository } from "@infra/db/mongodb/animal-mongo-repository";
import { DbUpdateAnimal } from "@data/usecases/update-animal/db-update-animal";

export const makeUpdateAnimalController = (): IController => {
	const validations = makeUpdateAnimalValidations();
	const animalMongoRepository = new AnimalMongoRepository();
	const dbUpdateAnimal = new DbUpdateAnimal(animalMongoRepository);

	return new UpdateAnimalController(validations, dbUpdateAnimal);
};
