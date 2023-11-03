import { IAddAnimalModel } from "@domain/usecases/add-animal";
import { MongoHelper } from "./mongo-helper";
import { IAddAnimalRepository } from "@data/usecases/add-animal/db-add-animal-protocols";
import { IRemoveAnimalByIdRepository } from "@data/protocols/db/animals/remove-animal-by-id-repository";
import { ObjectId } from "mongodb";
import { parseToObjectId } from "./utils/parse-to-object-id";
import { IListAnimalsByOwnerIdRepository } from "@data/protocols/db/animals/list-animals-by-owner-repository";
import { IAnimalModel } from "@domain/models/animals";
import { IUpdateAnimalByIdRepository } from "@data/protocols/db/animals/update-animal-by-id-repository";
import { IUpdateAnimalModel } from "@domain/usecases/update-animal";
import { ILoadAnimalByIdRepository } from "@data/protocols/db/animals/load-animal-by-id-repository";

export class AnimalMongoRepository
	implements
		IAddAnimalRepository,
		IRemoveAnimalByIdRepository,
		IListAnimalsByOwnerIdRepository,
		IUpdateAnimalByIdRepository,
		ILoadAnimalByIdRepository
{
	async loadAnimal(ownerId: string): Promise<IAnimalModel | null> {
		const animalsCollection = MongoHelper.getCollection("animals");

		const result = await animalsCollection.findOne({
			_id: parseToObjectId(ownerId),
		});

		return result ? MongoHelper.map(result) : null;
	}

	async updateAnimal(
		id: string,
		props: IUpdateAnimalModel
	): Promise<IAnimalModel | null> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const { value } = await animalsCollection.findOneAndUpdate(
			{ _id: parseToObjectId(id) },
			{
				$set: props,
			},
			{
				upsert: false,
			}
		);
		return value ? MongoHelper.map(value) : null;
	}
	async listAnimals(ownerId: string): Promise<IAnimalModel[]> {
		const animalsCollection = MongoHelper.getCollection("animals");

		const result = (await animalsCollection
			.aggregate([{ $match: { ownerId } }])
			.toArray()) as IAnimalModel[];

		return MongoHelper.mapCollection(result);
	}
	async removeAnimal(animalId: string | ObjectId): Promise<boolean> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const { ok } = await animalsCollection.findOneAndDelete({
			_id: parseToObjectId(animalId),
		});
		return ok === 1;
	}
	async addAnimal(animal: IAddAnimalModel): Promise<boolean> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const { acknowledged } = await animalsCollection.insertOne(animal);
		return acknowledged;
	}
}
