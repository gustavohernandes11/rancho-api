import request from "supertest";
import { Express } from "express";
import { setupApp } from "../config/app";
import { Collection } from "mongodb";
import { MongoHelper } from "@infra/db/mongodb/mongo-helper";
import { sign } from "jsonwebtoken";
import env from "../config/env";
jest.setTimeout(15000);

let app: Express;
let accountCollection: Collection;
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
			email: "any.email@gmail.com",
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

	describe("/api/animals", () => {
		it("should return 200 when sending valid animal data", async () => {
			const { accessToken, userId } = await mockDatabaseUser();
			await request(app)
				.post("/api/animals")
				.set("x-access-token", accessToken)
				.send({
					name: "any_name",
					ownerId: userId,
					age: mockISODate,
				})
				.expect(200);
		});
		it("should return 400 if the animal owner is not in the database", async () => {
			await request(app)
				.post("/api/animals")
				.send({
					name: "any_name",
					ownerId: "any_id",
					age: mockISODate,
				})
				.expect(400);
		});
	});
});
