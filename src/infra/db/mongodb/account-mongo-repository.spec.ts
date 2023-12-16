import { Collection } from "mongodb";
import { AccountMongoRepository } from "./account-mongo-repository";
import { MongoHelper } from "./mongo-helper";
import { IAddAccountModel } from "@/domain/usecases/add-account";

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

	type ISutTypes = {
		sut: AccountMongoRepository;
	};

	const makeSut = (): ISutTypes => {
		return { sut: new AccountMongoRepository() };
	};

	const mockAccountModel = (override?: any): IAddAccountModel => {
		return Object.assign(
			{
				name: "any_name",
				email: "any_email@/gmail.com",
				password: "any_hashed_password",
			},
			override || {}
		) as IAddAccountModel;
	};

	describe("add()", () => {
		it("should return true if the account is added", async () => {
			const { sut } = makeSut();
			const sucess = await sut.add(mockAccountModel());
			expect(sucess).toBe(true);
		});
	});
	describe("loadByEmail()", () => {
		it("should load the correct account by email", async () => {
			const { sut } = makeSut();
			await sut.add(mockAccountModel({ email: "johndoe@gmail.com" }));
			const account = await sut.loadByEmail("johndoe@gmail.com");
			expect(account).not.toBeNull();
			expect(account?.id).toBeTruthy();
			expect(account?.name).toBe("any_name");
			expect(account?.password).toBe("any_hashed_password");
		});
		it("should return null if the account do not exists", async () => {
			const { sut } = makeSut();
			const account = await sut.loadByEmail("any_email@gmail.com");
			expect(account).toBeNull();
		});
	});
	describe("updateAccessToken()", () => {
		it("should set or update the accessToken in the database", async () => {
			const { sut } = makeSut();
			const { insertedId } = await accountCollection.insertOne(
				mockAccountModel()
			);
			const fakeAccount = await accountCollection.findOne({
				_id: insertedId,
			});

			expect(fakeAccount?.accessToken).toBeFalsy();

			const accessToken = "any_token";
			await sut.updateAccessToken(insertedId.toHexString(), accessToken);

			const account = await accountCollection.findOne({
				_id: insertedId,
			});
			expect(account).toBeTruthy();
			expect(account!.accessToken).toBeTruthy();
			expect(account!.accessToken).toBe(accessToken);
		});
	});
	describe("checkByEmail()", () => {
		it("should return false if the account do not exists", async () => {
			const { sut } = makeSut();
			const response = await sut.checkByEmail(
				"non_existent_email@gmail.com"
			);
			expect(response).toBe(false);
		});
		it("should return true if the account exists", async () => {
			const { sut } = makeSut();
			await sut.add(
				mockAccountModel({
					email: "any_email@gmail.com",
				})
			);
			const response = await sut.checkByEmail("any_email@gmail.com");
			expect(response).toBe(true);
		});
	});
	describe("checkById()", () => {
		it("should return false if the account do not exists", async () => {
			const { sut } = makeSut();
			const response = await sut.checkById("non_existent_id");
			expect(response).toBe(false);
		});
		it("should return true if the account exists", async () => {
			const { sut } = makeSut();
			const { insertedId } = await accountCollection.insertOne(
				mockAccountModel()
			);

			const response = await sut.checkById(insertedId.toHexString());
			expect(response).toBe(true);
		});
		it("should work with a string as id", async () => {
			const { sut } = makeSut();
			const { insertedId } = await accountCollection.insertOne(
				mockAccountModel()
			);

			const response = await sut.checkById(insertedId.toHexString());
			expect(response).toBeTruthy();
		});
	});

	describe("loadByToken()", () => {
		beforeEach(() => {});
		it("should load the correct account from token without role", async () => {
			const { sut } = makeSut();

			const { insertedId } = await accountCollection.insertOne(
				mockAccountModel({ accessToken: "any_access_token" })
			);
			const response = await sut.loadByToken("any_access_token");

			expect(response!.id).toBeTruthy();
			expect(response!.id).toEqual(insertedId.toHexString());
		});
		it("should load the correct account with role", async () => {
			const { sut } = makeSut();

			const { insertedId } = await accountCollection.insertOne(
				mockAccountModel({
					accessToken: "any_access_token",
					role: "admin",
				})
			);
			const account = await sut.loadByToken("any_access_token", "admin");
			expect(account!.id).toEqual(insertedId.toHexString());
		});
		it("should return null if the role is not correct", async () => {
			const { sut } = makeSut();

			await accountCollection.insertOne(
				mockAccountModel({
					accessToken: "any_access_token",
					role: undefined,
				})
			);
			const account = await sut.loadByToken("any_access_token", "admin");
			expect(account).toBeNull();
		});
		it("should return the account even if the role is not provided when it's an admin", async () => {
			const { sut } = makeSut();

			await accountCollection.insertOne(
				mockAccountModel({
					accessToken: "any_access_token",
					role: "admin",
				})
			);
			const account = await sut.loadByToken("any_access_token");
			expect(account).toBeTruthy();
		});
		it("should return null if the accessToken is invalid", async () => {
			const { sut } = makeSut();

			await accountCollection.insertOne(
				mockAccountModel({
					accessToken: "any_access_token",
					role: "admin",
				})
			);
			const account = await sut.loadByToken("invalid_access_token");
			expect(account).toBeNull();
		});

		it("should return null if the account do not exists", async () => {
			const { sut } = makeSut();
			const account = await sut.loadByToken("any_access_token");
			expect(account).toBeNull();
		});
	});
});
