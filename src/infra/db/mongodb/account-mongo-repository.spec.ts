import { Collection } from "mongodb";
import { AccountMongoRepository } from "./account-mongo-repository";
import { MongoHelper } from "./mongo-helper";

describe("Account Mongo Repository", () => {
	let accountCollection: Collection;
	beforeAll(async () => {
		await MongoHelper.connect(
			process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api"
		);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		accountCollection = MongoHelper.getCollection("accounts");
		await accountCollection.deleteMany({});
	});

	const makeFakeAccount = () => ({
		name: "any_name",
		email: "any_email@gmail.com",
		password: "any_hashed_password",
	});
	describe("add()", () => {
		it("should return true if the account is added", async () => {
			const sut = new AccountMongoRepository();
			const sucess = await sut.add(makeFakeAccount());
			expect(sucess).toBe(true);
		});
	});
	describe("loadByEmail()", () => {
		it("should load the correct account by email", async () => {
			const sut = new AccountMongoRepository();
			await sut.add({
				name: "any_name",
				email: "any_email@gmail.com",
				password: "any_hashed_password",
			});
			const account = await sut.loadByEmail("any_email@gmail.com");
			expect(account).not.toBeNull();
			expect(account?.id).toBeTruthy();
			expect(account?.name).toBe("any_name");
			expect(account?.password).toBe("any_hashed_password");
		});
		it("should return null if the account do not exists", async () => {
			const sut = new AccountMongoRepository();
			const account = await sut.loadByEmail("any_email@gmail.com");
			expect(account).toBeNull();
		});
	});
});