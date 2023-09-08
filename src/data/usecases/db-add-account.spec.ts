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

	const makeSut = (): SutTypes => {
		const addAccountRepositoryStub = new AddAccountRepositoryStub();
		const sut = new DbAddAccount(addAccountRepositoryStub);

		return {
			sut,
			addAccountRepositoryStub,
		};
	};

	it("should call the correct addAccountRepository", () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
		const fakeAccount: IAccount = {
			name: "valid_name",
			email: "valid_email",
			password: "valid_password",
		};
		sut.add(fakeAccount);
		expect(repoSpy).toHaveBeenCalledTimes(1);
	});
});
