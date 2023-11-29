import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";
import { Collection } from "mongodb";
import { MongoHelper } from "@/infra/db/mongodb/mongo-helper";
import { sign } from "jsonwebtoken";
import env from "../config/env";
import { parseToObjectId } from "@/infra/db/mongodb/utils/parse-to-object-id";
jest.setTimeout(15000);

let app: Express;
let batchCollection: Collection;
let accountCollection: Collection;
let animalsCollection: Collection;

beforeAll(async () => {
	app = await setupApp();
	await MongoHelper.connect(process.env.MONGO_URL!);
});

afterAll(async () => {
	await MongoHelper.disconnect();
});

beforeEach(async () => {
	batchCollection = MongoHelper.getCollection("batches");
	accountCollection = MongoHelper.getCollection("accounts");
	animalsCollection = MongoHelper.getCollection("animals");
	await batchCollection.deleteMany({});
	await batchCollection.deleteMany({});
	await animalsCollection.deleteMany({});
});

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

		const { insertedId } = await batchCollection.insertOne({
			name: "any_batch_name",
			observation: "any_batch_observation",
			ownerId: userId,
		});

		return { userId, batchId: insertedId.toHexString(), accessToken };
	};

describe("Batch routes", () => {
	describe("GET /api/batches/:batchId", () => {
		it("should return 403 when not sending an accessToken", async () => {
			const { batchId } = await mockDatabaseBatchAndUser();
			await request(app).get(`/api/batches/${batchId}`).expect(403);
		});

		it("should return 404 when trying to get information about a non-existing batch", async () => {
			const { accessToken } = await mockDatabaseUser();
			const nonExistingBatchId = "non_existing_batch_id";
			await request(app)
				.get(`/api/batches/${nonExistingBatchId}`)
				.set("x-access-token", accessToken)
				.expect(404);
		});

		it("should return 200 and a list of animals when sending a batchId with the correct accessToken", async () => {
			const { batchId, accessToken, userId } =
				await mockDatabaseBatchAndUser();

			animalsCollection.insertMany([
				{
					name: "animal_name_1",
					age: "any_age",
					ownerId: userId,
					batchId: batchId,
				},
				{
					name: "animal_name_2",
					age: "any_age",
					ownerId: userId,
					batchId: batchId,
				},
				{
					name: "animal_name_3",
					age: "any_age",
					ownerId: userId,
					batchId: batchId,
				},
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
			const nonExistingBatchId = "non_existing_batch_id";
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

			const deletedBatch = await batchCollection.findOne({
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
			const changedName = "changed_batch_name";

			await request(app)
				.put(`/api/batches/${batchId}`)
				.set("x-access-token", accessToken)
				.send({
					name: changedName,
				})
				.expect(200);

			const changed = MongoHelper.map(
				await batchCollection.findOne({
					_id: parseToObjectId(batchId),
				})
			);
			expect(changed.name).toBe(changedName);
		});
	});

	describe("POST /api/batches", () => {
		it("should return 200 when sending valid batch data and accessToken", async () => {
			const { accessToken, userId } = await mockDatabaseUser();
			await request(app)
				.post("/api/batches")
				.set("x-access-token", accessToken)
				.send({
					name: "any_name",
					observation: "any_observation",
					ownerId: userId,
				})
				.expect(200);
		});

		it("should return 403 when not sending an accessToken", async () => {
			await request(app)
				.post("/api/batches")
				.send({
					name: "any_name",
					ownerId: "any_id",
				})
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

			batchCollection.insertMany([
				{
					name: "name_1",
					observation: "observation_1",
					ownerId: userId,
				},
				{
					name: "name_2",
					observation: "observation_2",
					ownerId: userId,
				},
				{
					name: "name_3",
					observation: "observation_3",
					ownerId: userId,
				},
				{
					name: "name_4",
					observation: "observation_4",
					ownerId: userId,
				},
			]);

			await request(app)
				.get("/api/batches")
				.set("x-access-token", accessToken)
				.send({})
				.then((response: any) => {
					expect(response.body).toHaveLength(4);

					expect(response.body[0].name).toBe("name_1");
					expect(response.body[0].observation).toBe("observation_1");
					expect(response.body[1].name).toBe("name_2");
					expect(response.body[1].observation).toBe("observation_2");
					expect(response.body[2].name).toBe("name_3");
					expect(response.body[2].observation).toBe("observation_3");
					expect(response.body[3].name).toBe("name_4");
					expect(response.body[3].observation).toBe("observation_4");
				});
		});

		it("should return 200 when the account and batches exist in the database", async () => {
			const { accessToken, userId } = await mockDatabaseUser();

			batchCollection.insertOne({
				name: "any_name",
				ownerId: userId,
			});

			await request(app)
				.get("/api/batches")
				.set("x-access-token", accessToken)
				.send({})
				.expect(200);
		});
	});
});
