import { IAccountModel } from "../../domain/models/account";
import { IAccount } from "../../domain/usecases/add-account";
import { IAddAccountRepository } from "../protocols/add-account-repository";
import { IHasher } from "../protocols/hasher";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
	class AddAccountRepositoryStub implements IAddAccountRepository {
		async add(account: IAccount): Promise<IAccountModel> {
			return new Promise((resolve) =>
				resolve({
					id: "any_id",
					name: "valid_name",
					email: "valid_email",
					password: "valid_password",
				})
			);
		}
	}
	class HasherStub implements IHasher {
		async hash(text: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_value"));
		}
	}
	type SutTypes = {
		sut: DbAddAccount;
		addAccountRepositoryStub: AddAccountRepositoryStub;
		hasherStub: HasherStub;
	};

	const makeFakeAccount = (): IAccount => ({
		name: "valid_name",
		email: "valid_email",
		password: "valid_password",
	});

	const makeSut = (): SutTypes => {
		const addAccountRepositoryStub = new AddAccountRepositoryStub();
		const hasherStub = new HasherStub();
		const sut = new DbAddAccount(addAccountRepositoryStub, hasherStub);

		return {
			sut,
			addAccountRepositoryStub,
			hasherStub,
		};
	};

	describe("addAccountRepository", () => {
		it("should call the correct addAccountRepository", () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount = makeFakeAccount();
			sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledTimes(1);
		});
		it("should use the incoming account properties in addAccountRepository", () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount = makeFakeAccount();
			sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledWith({
				...fakeAccount,
				password: "hashed_password",
			});
		});
		it("should return true on sucess", async () => {
			const { sut } = makeSut();
			const sucess = await sut.add(makeFakeAccount());
			expect(sucess).toBeTruthy();
		});
	});
});
