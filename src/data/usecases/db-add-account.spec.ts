import { IAccount } from "../../domain/usecases/add-account";
import { IAddAccountRepository } from "../protocols/add-account-repository";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
	class AddAccountRepositoryStub implements IAddAccountRepository {
		async add(account: IAccount): Promise<boolean> {
			return new Promise((resolve) => resolve(true));
		}
	}
	type SutTypes = {
		sut: DbAddAccount;
		addAccountRepositoryStub: AddAccountRepositoryStub;
	};

	const makeFakeAccount = (): IAccount => ({
		name: "valid_name",
		email: "valid_email",
		password: "valid_password",
	});

	const makeSut = (): SutTypes => {
		const addAccountRepositoryStub = new AddAccountRepositoryStub();
		const sut = new DbAddAccount(addAccountRepositoryStub);

		return {
			sut,
			addAccountRepositoryStub,
		};
	};

	describe("addAccountRepository", () => {
		it("should call the correct addAccountRepository", () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount: IAccount = makeFakeAccount();
			sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledTimes(1);
		});
		it("should use the incoming account properties in addAccountRepository", () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount: IAccount = makeFakeAccount();
			sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledWith({
				...fakeAccount,
				password: "hashed_password",
			});
		});
	});
});
