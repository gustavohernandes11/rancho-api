import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";
import { Collection } from "mongodb";
import { MongoHelper } from "@/infra/db/mongodb/mongo-helper";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { parseToObjectId } from "@/infra/db/mongodb/utils/parse-to-object-id";
import { mockAddAnimalModel } from "@/infra/db/mongodb/animal-mongo-repository.spec";

let app: Express;
let accountCollection: Collection;
let animalColletion: Collection;

describe("Animal routes", () => {
	const mockISODate = new Date().toISOString();

	beforeAll(async () => {
		app = await setupApp();
		await MongoHelper.connect(process.env.MONGO_URL!);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		animalColletion = MongoHelper.getCollection("animals");
		await animalColletion.deleteMany({});
		accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});

	interface IMockDatabaseUserType {
		userId: string;
		accessToken: string;
	}
	const mockDatabaseUser = async (): Promise<IMockDatabaseUserType> => {
		const { insertedId } = await accountCollection.insertOne({
			name: "any_name",
			email: "any.email@/gmail.com",
			password: "123",
		});
		const id = insertedId.toHexString();
		const accessToken = sign({ id }, env.jwtSecret);
		await accountCollection.updateOne(
			{
				_id: insertedId,
			},
			{
				$set: {
					accessToken,
				},
			}
		);
		return { accessToken, userId: id };
	};
	type IMockDatabaseAnimalAndUserType = {
		animalId: string;
		accessToken: string;
	};
	const mockDatabaseAnimalAndUser =
		async (): Promise<IMockDatabaseAnimalAndUserType> => {
			const { userId, accessToken } = await mockDatabaseUser();

			const { insertedId } = await animalColletion.insertOne(
				mockAddAnimalModel({ ownerId: userId })
			);

			return { animalId: insertedId.toHexString(), accessToken };
		};
	describe("GET /api/animals/:animalId", () => {
		it("should return 403 when not sending a accessToken", async () => {
			const { animalId } = await mockDatabaseAnimalAndUser();
			await request(app).get(`/api/animals/${animalId}`).expect(403);
		});
		it("should return 404 when trying to get information about a non-existing animal", async () => {
			const { accessToken } = await mockDatabaseUser();
			const nonExistingAnimalId = "NONEXISTENT_animal_id";
			await request(app)
				.get(`/api/animals/${nonExistingAnimalId}`)
				.set("x-access-token", accessToken)
				.expect(404);
		});
		it("should return 200 and animal information when sending a valid animalId with the correct accessToken", async () => {
			const { animalId, accessToken } = await mockDatabaseAnimalAndUser();
			await request(app)
				.get(`/api/animals/${animalId}`)
				.set("x-access-token", accessToken)
				.expect(200)
				.then((response) => {
					const animal = response.body;
					expect(animal).toHaveProperty("name");
					expect(animal).toHaveProperty("age");
					expect(animal).toHaveProperty("ownerId");
				});
		});
	});

	describe("DELETE /api/animals/:animalId", () => {
		it("should return 403 when not sending an accessToken", async () => {
			const { animalId } = await mockDatabaseAnimalAndUser();
			await request(app).delete(`/api/animals/${animalId}`).expect(403);
		});

		it("should return 404 when trying to delete a non-existing animal", async () => {
			const { accessToken } = await mockDatabaseUser();
			const nonExistingAnimalId = "NONEXISTENT_animal_id";
			await request(app)
				.delete(`/api/animals/${nonExistingAnimalId}`)
				.set("x-access-token", accessToken)
				.expect(404);
		});

		it("should return 200 when sending a valid animalId with the correct accessToken", async () => {
			const { animalId, accessToken } = await mockDatabaseAnimalAndUser();
			await request(app)
				.delete(`/api/animals/${animalId}`)
				.set("x-access-token", accessToken)
				.expect(200);
		});

		it("should delete the animal from the database when returning 200", async () => {
			const { animalId, accessToken } = await mockDatabaseAnimalAndUser();
			await request(app)
				.delete(`/api/animals/${animalId}`)
				.set("x-access-token", accessToken)
				.expect(200);

			const deletedAnimal = await animalColletion.findOne({
				_id: parseToObjectId(animalId),
			});

			expect(deletedAnimal).toBeNull();
		});
	});

	describe("PUT /api/animals/:animalId", () => {
		it("should return 403 when not sending a accessToken", async () => {
			const { animalId } = await mockDatabaseAnimalAndUser();
			await request(app)
				.put(`/api/animals/${animalId}`)
				.send({})
				.expect(403);
		});
		it("should return 400 when sending invalid animalId", async () => {
			const { accessToken } = await mockDatabaseAnimalAndUser();
			await request(app)
				.put("/api/animals/INVALID_ID")
				.set("x-access-token", accessToken)
				.send({})
				.expect(400);
		});
		it("should return 200 when sending a valid animalId with correct accessToken", async () => {
			const { animalId, accessToken } = await mockDatabaseAnimalAndUser();
			await request(app)
				.put(`/api/animals/${animalId}`)
				.set("x-access-token", accessToken)
				.send({ name: "any_updated_name" })
				.expect(200);
		});
		it("it should update the animal in the database when return 200", async () => {
			const { animalId, accessToken } = await mockDatabaseAnimalAndUser();
			const modifiedAge = new Date("01/01/2002").toISOString();
			const modifiedName = "MODIFIED_animal_name";

			await request(app)
				.put("/api/animals/" + animalId)
				.set("x-access-token", accessToken)
				.send({
					name: modifiedName,
					age: modifiedAge,
				})
				.expect(200);

			const modified = MongoHelper.map(
				await animalColletion.findOne({
					_id: parseToObjectId(animalId),
				})
			);
			expect(modified.age).toBe(modifiedAge);
			expect(modified.name).toBe(modifiedName);
		});
	});

	describe("POST /api/animals", () => {
		it("should return 200 when sending valid animal data and accessToken", async () => {
			const { accessToken, userId } = await mockDatabaseUser();
			await request(app)
				.post("/api/animals")
				.set("x-access-token", accessToken)
				.send(mockAddAnimalModel({ ownerId: userId }))
				.expect(200);
		});
		it("should return 403 when not sending a accessToken", async () => {
			await request(app)
				.post("/api/animals")
				.send(mockAddAnimalModel())
				.expect(403);
		});
	});
	describe("GET /api/animals", () => {
		it("should return 403 when not sending a accessToken", async () => {
			await request(app).get("/api/animals").send({}).expect(403);
		});
		it("should return 2xx when sending accessToken", async () => {
			const { accessToken } = await mockDatabaseUser();
			await request(app)
				.get("/api/animals")
				.set("x-access-token", accessToken)
				.send({})
				.expect([200, 204]);
		});

		it("should return 204 when the animal database is empty", async () => {
			const { accessToken } = await mockDatabaseUser();

			await request(app)
				.get("/api/animals")
				.set("x-access-token", accessToken)
				.send({})
				.expect(204);
		});

		it("should list the animals when it exists", async () => {
			const { accessToken, userId } = await mockDatabaseUser();
			const mockedDate = new Date().toISOString();
			animalColletion.insertMany([
				mockAddAnimalModel({
					name: "A1",
					age: mockedDate,
					ownerId: userId,
				}),
				mockAddAnimalModel({
					name: "A2",
					age: mockedDate,
					ownerId: userId,
				}),
				mockAddAnimalModel({
					name: "A3",
					age: mockedDate,
					ownerId: userId,
				}),
				mockAddAnimalModel({
					name: "A4",
					age: mockedDate,
					ownerId: userId,
				}),
			]);

			await request(app)
				.get("/api/animals")
				.set("x-access-token", accessToken)
				.send({})
				.then((response: any) => {
					expect(response.body).toHaveLength(4);

					expect(response.body[0].name).toBe("A1");
					expect(response.body[1].name).toBe("A2");
					expect(response.body[2].name).toBe("A3");
					expect(response.body[3].name).toBe("A4");
				});
		});
		it("should return 200 when the account and animals exists in the database", async () => {
			const { accessToken, userId } = await mockDatabaseUser();
			const mockedDate = new Date().toISOString();
			animalColletion.insertOne(
				mockAddAnimalModel({
					age: mockedDate,
					ownerId: userId,
				})
			);

			await request(app)
				.get("/api/animals")
				.set("x-access-token", accessToken)
				.send({})
				.expect(200);
		});
	});
	describe("PUT /api/animals", () => {
		it("should return 200 when sending valid animal data and accessToken", async () => {
			const { accessToken, animalId } = await mockDatabaseAnimalAndUser();
			await request(app)
				.put("/api/animals")
				.set("x-access-token", accessToken)
				.send([
					{
						id: animalId,
						props: {
							name: "any_name",
							gender: "F",
							age: mockISODate,
						},
					},
				])
				.expect(200);
		});
		it("should return 403 when not sending a accessToken", async () => {
			await request(app).post("/api/animals").send([]).expect(403);
		});
		it("it should update all the animals in the database when return 200", async () => {
			const { animalId, accessToken } = await mockDatabaseAnimalAndUser();
			const modifiedAge = new Date("01/01/2002").toISOString();
			const modifiedName = "MODIFIED_animal_name";
			const modifiedBatchId = "MODIFIED_batch_id";

			await request(app)
				.put("/api/animals/")
				.set("x-access-token", accessToken)
				.send([
					{
						id: animalId,
						props: {
							name: modifiedName,
							age: modifiedAge,
						},
					},
					{
						id: animalId,
						props: {
							batchId: modifiedBatchId,
						},
					},
				])
				.expect(200);

			const modified = MongoHelper.map(
				await animalColletion.findOne({
					_id: parseToObjectId(animalId),
				})
			);
			expect(modified.age).toBe(modifiedAge);
			expect(modified.name).toBe(modifiedName);
			expect(modified.batchId).toBe(modifiedBatchId);
		});
	});
});
