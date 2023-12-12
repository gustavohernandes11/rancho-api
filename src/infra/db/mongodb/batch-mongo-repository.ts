import { IAddBatchRepository } from "@/data/protocols/db/batch/add-batch-repository";
import { ICheckBatchByIdRepository } from "@/data/protocols/db/batch/check-batch-by-id-repository";
import { ICheckBatchByNameRepository } from "@/data/protocols/db/batch/check-batch-by-name-repository";
import { IListBatchesByOwnerIdRepository } from "@/data/protocols/db/batch/list-batches-repository";
import { IRemoveBatchByIdRepository } from "@/data/protocols/db/batch/remove-batch-by-id-repository";
import { IUpdateBatchByIdRepository } from "@/data/protocols/db/batch/update-batch-by-id-repository";
import { IAddBatchModel } from "@/domain/usecases/add-batch";
import { ObjectId } from "mongodb";
import { IBatchModel } from "@/domain/models/batch";
import { IUpdateBatchModel } from "@/domain/usecases/update-batch";
import { MongoHelper } from "./mongo-helper";
import { parseToObjectId } from "./utils/parse-to-object-id";
import { IBatchInfo } from "@/domain/models/batch-info";

export class BatchMongoRepository
	implements
		IAddBatchRepository,
		ICheckBatchByNameRepository,
		ICheckBatchByIdRepository,
		IListBatchesByOwnerIdRepository,
		IRemoveBatchByIdRepository,
		IUpdateBatchByIdRepository
{
	async checkByName(name: string, ownerId: string): Promise<boolean> {
		const batchesCollection = MongoHelper.getCollection("batches");
		const batch = await batchesCollection.findOne({ name, ownerId });
		return !!batch;
	}

	async listBatches(ownerId: string): Promise<IBatchModel[]> {
		const batchesCollection = MongoHelper.getCollection("batches");

		const result = (await batchesCollection
			.aggregate([{ $match: { ownerId } }])
			.toArray()) as IBatchModel[];

		return MongoHelper.mapCollection(result);
	}
	async addBatch(batch: IAddBatchModel): Promise<boolean> {
		const batchesCollection = MongoHelper.getCollection("batches");
		const { acknowledged } = await batchesCollection.insertOne(batch);
		return acknowledged;
	}
	async loadBatch(batchId: string): Promise<IBatchInfo | null> {
		const batchesCollection = MongoHelper.getCollection("batches");
		const animalsCollection = MongoHelper.getCollection("animals");

		const batch = await batchesCollection.findOne({
			_id: parseToObjectId(batchId),
		});
		if (!batch) return null;

		const count = await animalsCollection.countDocuments({
			batchId: batchId,
		});

		return {
			...MongoHelper.map(batch),
			count,
		};
	}
	async checkById(id: string): Promise<boolean> {
		const batchesCollection = MongoHelper.getCollection("batches");
		const batch = await batchesCollection.findOne({
			_id: parseToObjectId(id),
		});
		return !!batch;
	}

	async removeBatch(batchId: string | ObjectId): Promise<boolean> {
		const batchesCollection = MongoHelper.getCollection("batches");
		const { deletedCount } = await batchesCollection.deleteOne({
			_id: parseToObjectId(batchId),
		});
		return deletedCount > 0;
	}
	async updateBatch(
		id: string,
		props: IUpdateBatchModel
	): Promise<IBatchModel | null> {
		const batchesCollection = MongoHelper.getCollection("batches");
		const parsedId = parseToObjectId(id);
		const { ok } = await batchesCollection.findOneAndUpdate(
			{ _id: parsedId },
			{
				$set: props,
			},
			{
				upsert: false,
			}
		);
		if (ok) {
			const updated = await batchesCollection.findOne({
				_id: parseToObjectId(id),
			});
			if (updated) return MongoHelper.map(updated);
		}
		return null;
	}
}
