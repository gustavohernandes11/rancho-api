import { Collection } from "mongodb";
import { BatchMongoRepository } from "./batch-mongo-repository";
import { MongoHelper } from "./mongo-helper";
import { IAddBatchModel } from "@/domain/usecases/add-batch";
import { IUpdateBatchModel } from "@/domain/usecases/update-batch";

const makeFakeBatch = (): IAddBatchModel => ({
	name: "any_batch_name",
	ownerId: "any_owner_id",
});

describe("Batch Mongo Repository", () => {
	let batchesCollection: Collection;
	let accountCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(
			process.env.MONGO_URL || "mongodb://127.0.0.1:27017/rancho-api"
		);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		batchesCollection = MongoHelper.getCollection("batches");
		accountCollection = MongoHelper.getCollection("batches");
		await batchesCollection.deleteMany({});
		await accountCollection.deleteMany({});
	});

	describe("addBatch()", () => {
		it("should return true if the batch was added", async () => {
			const sut = new BatchMongoRepository();

			const result = await sut.addBatch(makeFakeBatch());
			expect(result).toBeTruthy();
		});
	});

	describe("checkByName()", () => {
		it("should return true when the batch exists in the database with this name", async () => {
			const sut = new BatchMongoRepository();
			await batchesCollection.insertOne({
				name: "any_batch_name",
				ownerId: "any_ownerId",
			});
			const result = await sut.checkByName("any_batch_name");
			expect(result).toBeTruthy();
		});
		it("should return false when the batch do not exists in the database with this name", async () => {
			const sut = new BatchMongoRepository();
			const result = await sut.checkByName("invalid_batch_name");
			expect(result).toBeFalsy();
		});
	});

	describe("checkById()", () => {
		it("should return true when the batch exists in the database with this ID", async () => {
			const sut = new BatchMongoRepository();
			const { insertedId } = await batchesCollection.insertOne({
				name: "any_batch_name",
				ownerId: "any_ownerId",
			});
			const result = await sut.checkById(insertedId.toHexString());
			expect(result).toBeTruthy();
		});
		it("should return false when the batch do not exists in the database with this ID", async () => {
			const sut = new BatchMongoRepository();
			const result = await sut.checkById("invalid_batch_name");
			expect(result).toBeFalsy();
		});
	});

	describe("listBatches()", () => {
		it("should return falsy if the ownerId is not valid", async () => {
			const sut = new BatchMongoRepository();

			const result = await sut.listBatches("non_existent_owner_id");

			expect(result).toHaveLength(0);
		});

		it("should return an array of batches from the correct ownerId", async () => {
			const sut = new BatchMongoRepository();

			const ownerId = "valid_owner_id";
			await batchesCollection.insertMany([
				{
					name: "batch_1",
					ownerId,
				},
				{
					name: "batch_2",
					ownerId,
				},
				{
					name: "batch_3",
					ownerId: "any_other_ownerId",
				},
			]);

			const result = await sut.listBatches(ownerId);

			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
		});
	});

	describe("removeBatch()", () => {
		it("should remove the batch from the database", async () => {
			const sut = new BatchMongoRepository();
			const { insertedId } = await batchesCollection.insertOne(
				makeFakeBatch()
			);
			const result = await sut.removeBatch(insertedId.toHexString());
			expect(result).toBeTruthy();
		});
		it("should return false if the batch does not exist", async () => {
			const sut = new BatchMongoRepository();
			const result = await sut.removeBatch("non_existent_id");
			expect(result).toBeFalsy();
		});

		it("should return false if exists batches but with other ID", async () => {
			const sut = new BatchMongoRepository();

			await batchesCollection.insertOne(makeFakeBatch());
			const result = await sut.removeBatch("wrong_id");
			expect(result).toBeFalsy();
		});
	});

	describe("updateBatch()", () => {
		it("should update the batch with the given ID", async () => {
			const sut = new BatchMongoRepository();
			const { insertedId } = await batchesCollection.insertOne(
				makeFakeBatch()
			);
			const updateData: IUpdateBatchModel = {
				name: "updated_name",
				ownerId: "updated_owner_id",
			};
			const result = await sut.updateBatch(
				insertedId.toHexString(),
				updateData
			);
			expect(result).not.toBeNull();
			const updatedBatch = await batchesCollection.findOne({
				_id: insertedId,
			});
			expect(updatedBatch).toEqual(expect.objectContaining(updateData));
		});

		it("should return null if the batch with the given ID does not exist", async () => {
			const sut = new BatchMongoRepository();
			const updateData: IUpdateBatchModel = {
				name: "updated_name",
				ownerId: "updated_owner_id",
			};
			const result = await sut.updateBatch("non_existent_id", updateData);
			expect(result).toBeNull();
		});
		it("should return the updated batch when success", async () => {
			const sut = new BatchMongoRepository();
			const { insertedId } = await batchesCollection.insertOne(
				makeFakeBatch()
			);
			const updateData: IUpdateBatchModel = {
				name: "updated_name",
				ownerId: "updated_owner_id",
			};
			const result = await sut.updateBatch(
				insertedId.toHexString(),
				updateData
			);
			expect(result?.name).toBe("updated_name");
			expect(result?.ownerId).toBe("updated_owner_id");
			expect(result?.id).toBeTruthy();
		});
	});
});
