import { IAddAnimal, IAddAnimalModel } from "@domain/usecases/add-animal";
import { MongoHelper } from "./mongo-helper";

export class AnimalMongoRepository implements IAddAnimal {
	async add(animal: IAddAnimalModel): Promise<boolean> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const { acknowledged } = await animalsCollection.insertOne(animal);
		return acknowledged;
	}
}
