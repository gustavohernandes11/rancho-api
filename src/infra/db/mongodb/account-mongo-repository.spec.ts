import { Collection } from "mongodb";
import { AccountMongoRepository } from "./account-mongo-repository";
import { MongoHelper } from "./mongo-helper";

describe("Account Mongo Repository", () => {
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
	describe("updateAcessToken()", () => {
		it("should update the access token correctly", async () => {
			const sut = new AccountMongoRepository();
			const { insertedId } = await accountCollection.insertOne(
				makeFakeAccount()
			);
			const fakeAccount = await accountCollection.findOne({
				_id: insertedId,
			});
			expect(fakeAccount?.acessToken).toBeFalsy();
			const accessToken = "any_token";
			await sut.updateAccessToken(insertedId, accessToken);

			const account = await accountCollection.findOne({
				_id: insertedId,
			});
			expect(account).toBeTruthy();
			expect(account!.accessToken).toBe(accessToken);
		});
	});
	describe("checkByEmail()", () => {
		it("should return false if the account do not exists", async () => {
			const sut = new AccountMongoRepository();
			const response = await sut.checkByEmail(
				"non_existent_email@gmail.com"
			);
			expect(response).toBe(false);
		});
		it("should return true if the account exists", async () => {
			const sut = new AccountMongoRepository();
			await sut.add({
				name: "any_name",
				email: "any_email@gmail.com",
				password: "any_hashed_password",
			});
			const response = await sut.checkByEmail("any_email@gmail.com");
			expect(response).toBe(true);
		});
	});
});
