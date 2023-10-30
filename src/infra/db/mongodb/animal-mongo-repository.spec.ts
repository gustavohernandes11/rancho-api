import { Collection, ObjectId } from "mongodb";
import { IAddAnimalModel } from "../../../domain/usecases/add-animal";
import { AnimalMongoRepository } from "./animal-mongo-repository";
import { MongoHelper } from "./mongo-helper";

const makeFakeAnimal = (): IAddAnimalModel => ({
	name: "any_animal_name",
	ownerId: "any_id",
	age: new Date("12/12/2019"),
});
describe("Animal Mongo Repository", () => {
	let animalsCollection: Collection;
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
		await animalsCollection.deleteMany({});
	});

	describe("Add()", () => {
		it("should return true if the animal was added", async () => {
			const sut = new AnimalMongoRepository();

			const result = await sut.add(makeFakeAnimal());
			expect(result).toBeTruthy();
		});
	});
});
