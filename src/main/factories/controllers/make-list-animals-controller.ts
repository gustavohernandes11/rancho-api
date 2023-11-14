import { AccountMongoRepository } from "@/infra/db/mongodb/account-mongo-repository";
import { AnimalMongoRepository } from "@/infra/db/mongodb/animal-mongo-repository";
import { IController } from "@/presentation/protocols";
import { ListAnimalsController } from "@/presentation/controllers/animals/list-animals-controller";
import { DbListAnimals } from "@/data/usecases/list-animals/db-list-animals";

export const makeListAnimalsController = (): IController => {
	const accountMongoRepoisitory = new AccountMongoRepository();
	const animalMongoRepository = new AnimalMongoRepository();
	const dbListAnimals = new DbListAnimals(
		animalMongoRepository,
		accountMongoRepoisitory
	);

	return new ListAnimalsController(dbListAnimals);
};
