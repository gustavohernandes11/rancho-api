import { Collection } from "mongodb";
import { IAddAnimalModel } from "@/domain/usecases/add-animal";
import { AnimalMongoRepository } from "./animal-mongo-repository";
import { MongoHelper } from "./mongo-helper";

const makeFakeAnimal = (): IAddAnimalModel => ({
	name: "any_animal_name",
	ownerId: "any_id",
	age: new Date("12/12/2019").toISOString(),
});
describe("Animal Mongo Repository", () => {
	let animalsCollection: Collection;
	let accountCollection: Collection;
	let batchesCollection: Collection;

	beforeAll(async () => {
		await MongoHelper.connect(
			process.env.MONGO_URL || "mongodb://127.0.0.1:27017/rancho-api"
		);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		animalsCollection = MongoHelper.getCollection("animals");
		accountCollection = MongoHelper.getCollection("accounts");
		batchesCollection = MongoHelper.getCollection("batches");

		await animalsCollection.deleteMany({});
		await accountCollection.deleteMany({});
		await batchesCollection.deleteMany({});
	});

	interface IMockDatabaseUserType {
		userId: string;
	}
	const mockDatabaseUser = async (): Promise<IMockDatabaseUserType> => {
		const { insertedId } = await accountCollection.insertOne({
			name: "any_name",
			email: "any.email@/gmail.com",
			password: "123",
		});
		const id = insertedId.toHexString();

		return { userId: id };
	};

	describe("listByBatch()", () => {
		it("should return an empty array when there is no batch with the given ID", async () => {
			const sut = new AnimalMongoRepository();
			const result = await sut.listByBatch("non_existent_batch_id");

			expect(Array.isArray(result)).toBe(true);
			expect(result?.length).toBe(0);
		});

		it("should return only the animals from the correct batch", async () => {
			const sut = new AnimalMongoRepository();

			const { insertedIds } = await batchesCollection.insertMany([
				{ name: "batch_1", ownerId: "any_ownerId" },
				{ name: "batch_2", ownerId: "any_ownerId" },
			]);

			await animalsCollection.insertMany([
				{
					name: "animal_1",
					ownerId: "any_ownerId",
					batchId: insertedIds[0].toHexString(),
					age: new Date("01/01/2000").toISOString(),
				},
				{
					name: "animal_2",
					ownerId: "any_ownerId",
					batchId: insertedIds[0].toHexString(),
					age: new Date("01/01/2000").toISOString(),
				},
				{
					name: "animal_3",
					ownerId: "any_ownerId",
					batchId: insertedIds[1].toHexString(),
					age: new Date("01/01/2000").toISOString(),
				},
				{
					name: "animal_4",
					ownerId: "any_ownerId",
					batchId: insertedIds[1].toHexString(),
					age: new Date("01/01/2000").toISOString(),
				},
			]);

			const animalsFromBatch1 = await sut.listByBatch(
				insertedIds[0].toHexString()
			);
			const animalsFromBatch2 = await sut.listByBatch(
				insertedIds[1].toHexString()
			);

			expect(animalsFromBatch1?.length).toBe(2);
			expect(animalsFromBatch2?.length).toBe(2);
		});
	});

	describe("loadAnimal()", () => {
		it("should return null if the animal is not in the database", async () => {
			const sut = new AnimalMongoRepository();
			const animal = await sut.loadAnimal("any_id");
			expect(animal).toBeNull();
		});
		it("should return the animal from the correct animal from the database", async () => {
			const sut = new AnimalMongoRepository();
			const { insertedIds } = await animalsCollection.insertMany([
				{
					name: "first_animal",
					ownerId: "any_id",
					age: new Date("01/01/2000"),
				},
				{
					name: "second_animal",
					ownerId: "any_id2",
					age: new Date("01/01/2000"),
				},
			]);
			let result = await sut.loadAnimal(insertedIds[0].toHexString());
			expect(result?.name).toBe("first_animal");
			result = await sut.loadAnimal(insertedIds[1].toHexString());
			expect(result?.name).toBe("second_animal");
		});
	});
	describe("updateAnimal()", () => {
		it("should update only the age when required", async () => {
			const sut = new AnimalMongoRepository();
			const updatedDate = new Date("11/11/2019").toISOString();
			const { insertedId } = await animalsCollection.insertOne({
				name: "any_animal_name",
				ownerId: "any_id",
				age: new Date("12/12/2019").toISOString(),
			});
			await sut.updateAnimal(insertedId.toHexString(), {
				age: updatedDate,
			});

			const animal = await animalsCollection.findOne({
				_id: insertedId,
			});

			expect(animal!.age).toBe(updatedDate);
			expect(animal!.name).toBe("any_animal_name");
			expect(animal!.ownerId).toBe("any_id");
		});
		it("should update only the name when required", async () => {
			const sut = new AnimalMongoRepository();
			const { insertedId } = await animalsCollection.insertOne({
				name: "any_animal_name",
				ownerId: "any_id",
				age: new Date("12/12/2019").toISOString(),
			});
			await sut.updateAnimal(insertedId.toHexString(), {
				name: "modified_name",
			});
			const animal = await animalsCollection.findOne({
				_id: insertedId,
			});

			expect(animal!.age).toBe(new Date("12/12/2019").toISOString());
			expect(animal!.name).toBe("modified_name");
			expect(animal!.ownerId).toBe("any_id");
		});
		it("should update only the ownerId when required", async () => {
			const sut = new AnimalMongoRepository();
			const { insertedId } = await animalsCollection.insertOne({
				name: "any_animal_name",
				ownerId: "any_id",
				age: new Date("12/12/2019").toISOString(),
			});

			await sut.updateAnimal(insertedId.toHexString(), {
				ownerId: "modified_ownerId",
			});

			const animal = await animalsCollection.findOne({ _id: insertedId });

			expect(animal!.ownerId).toBe("modified_ownerId");
			expect(animal!.age).toBe(new Date("12/12/2019").toISOString());
			expect(animal!.name).toBe("any_animal_name");
		});
		it("should return the updated animal when the update is correctly done", async () => {
			const sut = new AnimalMongoRepository();
			const mockedDate = new Date("02/12/2019").toISOString();

			const { insertedId } = await animalsCollection.insertOne({
				name: "any_animal_name",
				ownerId: "any_id",
				age: new Date("12/12/2019").toISOString(),
			});

			const result = await sut.updateAnimal(insertedId.toHexString(), {
				name: "modified_animal_name",
				ownerId: "modified_ownerId",
				age: mockedDate,
			});

			expect(result).toBeTruthy();
			expect(result?.name).toBe("modified_animal_name");
			expect(result?.ownerId).toBe("modified_ownerId");
			expect(result?.age).toBe(mockedDate);
		});
		it("should return null when the animal do not exists in the database", async () => {
			const sut = new AnimalMongoRepository();
			const result = await sut.updateAnimal("invalid_id", {
				name: "modified_animal_name",
				ownerId: "modified_ownerId",
				age: new Date("02/12/2019").toISOString(),
			});

			expect(result).toBeNull();
		});
	});
	describe("addAnimal()", () => {
		it("should return true if the animal was added", async () => {
			const sut = new AnimalMongoRepository();

			const result = await sut.addAnimal(makeFakeAnimal());
			expect(result).toBeTruthy();
		});
	});
	describe("removeAnimal()", () => {
		it("should remove the animal from the database", async () => {
			const { insertedId } = await animalsCollection.insertOne(
				makeFakeAnimal()
			);
			const sut = new AnimalMongoRepository();
			await sut.removeAnimal(insertedId);

			const removed = await animalsCollection.findOne({
				id: insertedId,
			});

			expect(removed).toBeFalsy();
		});
		it("should work with strings", async () => {
			const { insertedId } = await animalsCollection.insertOne(
				makeFakeAnimal()
			);
			const sut = new AnimalMongoRepository();
			await sut.removeAnimal(insertedId.toHexString());

			const removed = await animalsCollection.findOne({
				id: insertedId,
			});

			expect(removed).toBeFalsy();
		});

		it("should return false when the animal do not exists in the database", async () => {
			const sut = new AnimalMongoRepository();
			const result = await sut.removeAnimal("invalid_id");

			expect(result).toBeFalsy();
		});
		it("should return true when remove the animal from the database", async () => {
			const { insertedId } = await animalsCollection.insertOne(
				makeFakeAnimal()
			);
			const sut = new AnimalMongoRepository();
			const result = await sut.removeAnimal(insertedId);

			expect(result).toBeTruthy();
		});
	});
	describe("listAnimals()", () => {
		it("should list the correct data length from the database", async () => {
			const sut = new AnimalMongoRepository();
			const { userId } = await mockDatabaseUser();
			let result = await sut.listAnimals(userId);
			expect(result.length).toBe(0);

			await animalsCollection.insertMany([
				{
					name: "any_animal_name",
					ownerId: userId,
					age: new Date("12/12/2019"),
				},
				{
					name: "any_animal_name",
					ownerId: userId,
					age: new Date("12/12/2019"),
				},
				{
					name: "any_animal_name",
					ownerId: userId,
					age: new Date("12/12/2019"),
				},
			]);

			result = await sut.listAnimals(userId);
			expect(result.length).toBe(3);
		});
		it("should list the data from the correct ownerId", async () => {
			const sut = new AnimalMongoRepository();
			const { userId } = await mockDatabaseUser();

			await animalsCollection.insertMany([
				{
					name: "any_animal_name",
					ownerId: userId,
					age: new Date("12/12/2019"),
				},
				{
					name: "any_animal_name",
					ownerId: userId,
					age: new Date("12/12/2019"),
				},
				{
					name: "any_animal_name",
					ownerId: "invalid_id",
					age: new Date("12/12/2019"),
				},
			]);

			const result = await sut.listAnimals(userId);
			expect(result.length).toBe(2);
		});
	});
});
