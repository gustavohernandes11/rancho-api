import { IAddAnimalModel } from "@/domain/usecases/add-animal";
import { MongoHelper } from "./mongo-helper";
import { IAddAnimalRepository } from "@/data/usecases/add-animal/db-add-animal-protocols";
import { IRemoveAnimalByIdRepository } from "@/data/protocols/db/animals/remove-animal-by-id-repository";
import { ObjectId } from "mongodb";
import { parseToObjectId } from "./utils/parse-to-object-id";
import { IListAnimalsByOwnerIdRepository } from "@/data/protocols/db/animals/list-animals-by-owner-repository";
import { IAnimalModel } from "@/domain/models/animals";
import { IUpdateAnimalByIdRepository } from "@/data/protocols/db/animals/update-animal-by-id-repository";
import { IUpdateAnimalModel } from "@/domain/usecases/update-animal";
import { ILoadAnimalByIdRepository } from "@/data/protocols/db/animals/load-animal-by-id-repository";
import { IListAnimalsByBatchRepository } from "@/data/protocols/db/animals/list-animals-by-batch-repository";
import { ICheckAnimalByIdRepository } from "@/data/protocols/db/animals/check-animal-by-id-repository";

export class AnimalMongoRepository
	implements
		IAddAnimalRepository,
		IRemoveAnimalByIdRepository,
		IListAnimalsByOwnerIdRepository,
		IListAnimalsByBatchRepository,
		IUpdateAnimalByIdRepository,
		ILoadAnimalByIdRepository,
		IListAnimalsByBatchRepository,
		ICheckAnimalByIdRepository
{
	async checkById(id: string): Promise<boolean> {
		const animalsCollection = MongoHelper.getCollection("animals");

		const result = await animalsCollection.findOne(
			{
				_id: parseToObjectId(id),
			},
			{
				projection: {
					_id: 1,
				},
			}
		);

		return !!result;
	}
	async listByBatch(batchId: string): Promise<IAnimalModel[] | null> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const result = (await animalsCollection
			.aggregate([{ $match: { batchId } }])
			.toArray()) as IAnimalModel[];

		return MongoHelper.mapCollection(result);
	}
	async loadAnimal(animalId: string): Promise<IAnimalModel | null> {
		const animalsCollection = MongoHelper.getCollection("animals");

		const result = await animalsCollection.findOne({
			_id: parseToObjectId(animalId),
		});

		return result ? MongoHelper.map(result) : null;
	}

	async updateAnimal(
		id: string,
		props: IUpdateAnimalModel
	): Promise<IAnimalModel | null> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const parsedId = parseToObjectId(id);

		const { modifiedCount } = await animalsCollection.updateOne(
			{ _id: parsedId },
			{
				$set: {
					ownerId: props.ownerId,
					age: props.age,
					name: props.name,
					gender: props.gender,
					batchId: props.batchId,
					paternityId: props.paternityId,
					maternityId: props.maternityId,
					observation: props.observation,
					code: props.code,
				},
			},
			{
				ignoreUndefined: true,
			}
		);
		if (modifiedCount) {
			const updated = await animalsCollection.findOne({
				_id: parsedId,
			});
			if (updated) return MongoHelper.map(updated);
		}
		return null;
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
		const { deletedCount } = await animalsCollection.deleteOne({
			_id: parseToObjectId(animalId),
		});
		return deletedCount > 0;
	}
	async addAnimal(animal: IAddAnimalModel): Promise<boolean> {
		const animalsCollection = MongoHelper.getCollection("animals");
		const { acknowledged } = await animalsCollection.insertOne(animal);
		return acknowledged;
	}
}
