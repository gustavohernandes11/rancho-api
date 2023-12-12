import { IController } from "@/presentation/protocols";
import { AnimalMongoRepository } from "@/infra/db/mongodb/animal-mongo-repository";
import { UpdateManyAnimalsController } from "@/presentation/controllers/animals/update-many-animals-controller";
import { DbUpdateManyAnimals } from "@/data/usecases/update-many-animals/db-update-many-animals";
import { makeUpdateManyAnimalsValidations } from "../validation/make-update-many-animals-validations";

export const makeUpdateAnimalController = (): IController => {
	const validations = makeUpdateManyAnimalsValidations();
	const animalMongoRepository = new AnimalMongoRepository();
	const dbUpdateAnimal = new DbUpdateManyAnimals(animalMongoRepository);

	return new UpdateManyAnimalsController(validations, dbUpdateAnimal);
};
