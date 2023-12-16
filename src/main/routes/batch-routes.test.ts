import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";
import { Collection } from "mongodb";
import { MongoHelper } from "@/infra/db/mongodb/mongo-helper";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { parseToObjectId } from "@/infra/db/mongodb/utils/parse-to-object-id";
import { mockAddAnimalModel } from "@/infra/db/mongodb/animal-mongo-repository.spec";
import { mockAddBatchModel } from "@/infra/db/mongodb/batch-mongo-repository.spec";

let app: Express;
let batchesCollection: Collection;
let accountCollection: Collection;
let animalsCollection: Collection;

interface IMockDatabaseUserType {
	userId: string;
	accessToken: string;
}

const mockDatabaseUser = async (): Promise<IMockDatabaseUserType> => {
	const { insertedId } = await accountCollection.insertOne({
		name: "any_name",
		email: "any.email@/gmail.com",
		password: "hashed_password",
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

type IMockDatabaseBatchAndUserType = {
	batchId: string;
	accessToken: string;
	userId: string;
};

const mockDatabaseBatchAndUser =
	async (): Promise<IMockDatabaseBatchAndUserType> => {
		const { userId, accessToken } = await mockDatabaseUser();

		const { insertedId } = await batchesCollection.insertOne({
			name: "any_batch_name",
			observation: "any_batch_observation",
			ownerId: userId,
		});

		return { userId, batchId: insertedId.toHexString(), accessToken };
	};

describe("Batch routes", () => {
	beforeAll(async () => {
		app = await setupApp();
		await MongoHelper.connect(process.env.MONGO_URL!);
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

	describe("GET /api/batches/:batchId/info", () => {
		it("should return 403 when not sending an accessToken", async () => {
			const { batchId } = await mockDatabaseBatchAndUser();
			await request(app).get(`/api/batches/${batchId}/info`).expect(403);
		});

		it("should return 404 when trying to get information about a non-existing batch", async () => {
			const { accessToken } = await mockDatabaseUser();
			const nonExistingBatchId = "NONEXISTENT_batch_id";
			await request(app)
				.get(`/api/batches/${nonExistingBatchId}/info`)
				.set("x-access-token", accessToken)
				.expect(404);
		});

		it("should return 200 with the batch info when the batch exists and accessToken is provided", async () => {
			const { batchId, accessToken, userId } =
				await mockDatabaseBatchAndUser();

			await animalsCollection.insertMany([
				mockAddAnimalModel({ ownerId: userId, batchId }),
				mockAddAnimalModel({ ownerId: userId, batchId }),
				mockAddAnimalModel({ ownerId: userId, batchId }),
			]);

			await request(app)
				.get(`/api/batches/${batchId}/info`)
				.set("x-access-token", accessToken)
				.expect(200)
				.then(({ body }) => {
					expect(body).toEqual({
						name: "any_batch_name",
						observation: "any_batch_observation",
						id: batchId,
						ownerId: userId,
						count: 3,
					});
				});
		});
	});
	describe("GET /api/batches/:batchId", () => {
		it("should return 403 when not sending an accessToken", async () => {
			const { batchId } = await mockDatabaseBatchAndUser();
			await request(app).get(`/api/batches/${batchId}`).expect(403);
		});

		it("should return 404 when trying to get information about a non-existing batch", async () => {
			const { accessToken } = await mockDatabaseUser();
			const nonExistingBatchId = "NONEXISTENT_batch_id";
			await request(app)
				.get(`/api/batches/${nonExistingBatchId}`)
				.set("x-access-token", accessToken)
				.expect(404);
		});

		it("should return 200 and a list of animals when sending a batchId with the correct accessToken", async () => {
			const { batchId, accessToken, userId } =
				await mockDatabaseBatchAndUser();

			animalsCollection.insertMany([
				mockAddAnimalModel({ ownerId: userId, batchId }),
				mockAddAnimalModel({ ownerId: userId, batchId }),
				mockAddAnimalModel({ ownerId: userId, batchId }),
			]);

			await request(app)
				.get(`/api/batches/${batchId}`)
				.set("x-access-token", accessToken)
				.expect(200)
				.then((response) => {
					const animalsFromBatch = response.body;
					expect(animalsFromBatch).toHaveLength(3);
					expect(animalsFromBatch[0]).toHaveProperty("name");
					expect(animalsFromBatch[0]).toHaveProperty("ownerId");
					expect(animalsFromBatch[0].batchId).toBe(batchId);
				});
		});
	});

	describe("DELETE /api/batches/:batchId", () => {
		it("should return 403 when not sending an accessToken", async () => {
			const { batchId } = await mockDatabaseBatchAndUser();
			await request(app).delete(`/api/batches/${batchId}`).expect(403);
		});

		it("should return 404 when trying to delete a non-existing batch", async () => {
			const { accessToken } = await mockDatabaseUser();
			const nonExistingBatchId = "NONEXISTENT_batch_id";
			await request(app)
				.delete(`/api/batches/${nonExistingBatchId}`)
				.set("x-access-token", accessToken)
				.expect(404);
		});

		it("should return 200 when sending a valid batchId with the correct accessToken", async () => {
			const { batchId, accessToken } = await mockDatabaseBatchAndUser();
			await request(app)
				.delete(`/api/batches/${batchId}`)
				.set("x-access-token", accessToken)
				.expect(200);
		});

		it("should delete the batch from the database when returning 200", async () => {
			const { batchId, accessToken } = await mockDatabaseBatchAndUser();
			await request(app)
				.delete(`/api/batches/${batchId}`)
				.set("x-access-token", accessToken)
				.expect(200);

			const deletedBatch = await batchesCollection.findOne({
				_id: parseToObjectId(batchId),
			});

			expect(deletedBatch).toBeNull();
		});
	});

	describe("PUT /api/batches/:batchId", () => {
		it("should return 403 when not sending an accessToken", async () => {
			const { batchId } = await mockDatabaseBatchAndUser();
			await request(app)
				.put(`/api/batches/${batchId}`)
				.send({})
				.expect(403);
		});

		it("should return 400 when sending an invalid batchId", async () => {
			const { accessToken } = await mockDatabaseBatchAndUser();
			await request(app)
				.put("/api/batches/INVALID_ID")
				.set("x-access-token", accessToken)
				.send({})
				.expect(400);
		});

		it("should return 400 when not sending a valid data to update", async () => {
			const { batchId, accessToken } = await mockDatabaseBatchAndUser();
			await request(app)
				.put(`/api/batches/${batchId}`)
				.set("x-access-token", accessToken)
				.send({})
				.expect(400);
		});

		it("should update the batch in the database when returning 200", async () => {
			const { batchId, accessToken } = await mockDatabaseBatchAndUser();
			const modifiedName = "MODIFIED_batch_name";

			await request(app)
				.put(`/api/batches/${batchId}`)
				.set("x-access-token", accessToken)
				.send({
					name: modifiedName,
				})
				.expect(200);

			const changed = MongoHelper.map(
				await batchesCollection.findOne({
					_id: parseToObjectId(batchId),
				})
			);
			expect(changed.name).toBe(modifiedName);
		});
	});

	describe("POST /api/batches", () => {
		it("should return 200 when sending valid batch data and accessToken", async () => {
			const { accessToken, userId } = await mockDatabaseUser();
			await request(app)
				.post("/api/batches")
				.set("x-access-token", accessToken)
				.send(mockAddBatchModel({ ownerId: userId }))
				.expect(200);
		});

		it("should return 403 when not sending an accessToken", async () => {
			await request(app)
				.post("/api/batches")
				.send(mockAddBatchModel())
				.expect(403);
		});
	});

	describe("GET /api/batches", () => {
		it("should return 403 when not sending an accessToken", async () => {
			await request(app).get("/api/batches").send({}).expect(403);
		});

		it("should return 204 when the batch database is empty", async () => {
			const { accessToken } = await mockDatabaseUser();

			await request(app)
				.get("/api/batches")
				.set("x-access-token", accessToken)
				.send({})
				.expect(204);
		});

		it("should list the batches when they exist", async () => {
			const { accessToken, userId } = await mockDatabaseUser();

			batchesCollection.insertMany([
				mockAddBatchModel({
					name: "B1",
					observation: "Obs1",
					ownerId: userId,
				}),
				mockAddBatchModel({
					name: "B2",
					observation: "Obs2",
					ownerId: userId,
				}),
				mockAddBatchModel({
					name: "B3",
					observation: "Obs3",
					ownerId: userId,
				}),
				mockAddBatchModel({
					name: "B4",
					observation: "Obs4",
					ownerId: userId,
				}),
			]);

			await request(app)
				.get("/api/batches")
				.set("x-access-token", accessToken)
				.send({})
				.then((response: any) => {
					expect(response.body).toHaveLength(4);
					expect(response.body[0].name).toBe("B1");
					expect(response.body[0].observation).toBe("Obs1");
					expect(response.body[1].name).toBe("B2");
					expect(response.body[1].observation).toBe("Obs2");
					expect(response.body[2].name).toBe("B3");
					expect(response.body[2].observation).toBe("Obs3");
					expect(response.body[3].name).toBe("B4");
					expect(response.body[3].observation).toBe("Obs4");
				});
		});

		it("should return 200 when the account and batches exist in the database", async () => {
			const { accessToken, userId } = await mockDatabaseUser();

			batchesCollection.insertOne(mockAddBatchModel({ ownerId: userId }));

			await request(app)
				.get("/api/batches")
				.set("x-access-token", accessToken)
				.send({})
				.expect(200);
		});
	});
});
