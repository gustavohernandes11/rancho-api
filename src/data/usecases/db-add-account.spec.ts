import { IAccountModel } from "../../domain/models/account";
import { IAddAccountModel } from "../../domain/usecases/add-account";
import { IAddAccountRepository } from "../protocols/add-account-repository";
import { IEncrypter } from "../protocols/encrypter";
import { ILoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";
import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount", () => {
	class AddAccountRepositoryStub implements IAddAccountRepository {
		async add(account: IAddAccountModel): Promise<IAccountModel> {
			return new Promise((resolve) =>
				resolve({
					id: "any_id",
					...account,
				})
			);
		}
	}
	class LoadAccountByEmailRepositoryStub
		implements ILoadAccountByEmailRepository
	{
		async loadByEmail(email: string): Promise<IAccountModel | null> {
			return new Promise((resolve) => resolve(null));
		}
	}
	class EncrypterStub implements IEncrypter {
		async encrypt(text: string): Promise<string> {
			return new Promise((resolve) => resolve("hashed_password"));
		}
	}
	type SutTypes = {
		sut: DbAddAccount;
		addAccountRepositoryStub: IAddAccountRepository;
		loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
		encrypterStub: IEncrypter;
	};

	const makeFakeAccount = (): IAddAccountModel => ({
		name: "valid_name",
		email: "valid_email",
		password: "valid_password",
	});

	const makeSut = (): SutTypes => {
		const addAccountRepositoryStub = new AddAccountRepositoryStub();
		const encrypterStub = new EncrypterStub();
		const loadAccountByEmailRepositoryStub =
			new LoadAccountByEmailRepositoryStub();
		const sut = new DbAddAccount(
			addAccountRepositoryStub,
			encrypterStub,
			loadAccountByEmailRepositoryStub
		);

		return {
			sut,
			encrypterStub,
			loadAccountByEmailRepositoryStub,
			addAccountRepositoryStub,
		};
	};

	describe("addAccountRepository", () => {
		it("should return an account if success", async () => {
			const { sut } = makeSut();
			const fakeAccount = makeFakeAccount();
			const account = await sut.add(fakeAccount);
			expect(account).toEqual({
				id: "any_id",
				name: "valid_name",
				email: "valid_email",
				password: "hashed_password",
			});
		});
		it("should call the correct addAccountRepository", async () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount = makeFakeAccount();
			await sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledTimes(1);
		});
		it("should use the incoming account properties in addAccountRepository", async () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount = makeFakeAccount();
			await sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledWith({
				...fakeAccount,
				password: "hashed_password",
			});
		});
		it("should return true on addAccountRepository sucess", async () => {
			const { sut } = makeSut();
			const sucess = await sut.add(makeFakeAccount());
			expect(sucess).toBeTruthy();
		});
		it("should throw if add addAccountRepository throws", async () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			jest.spyOn(addAccountRepositoryStub, "add").mockReturnValueOnce(
				new Promise((_, reject) => reject(new Error()))
			);
			const promise = sut.add(makeFakeAccount());
			await expect(promise).rejects.toThrow();
		});
	});
	describe("encrypter", () => {
		it("should call the correct encrypt method", async () => {
			const { sut, encrypterStub } = makeSut();
			const encrypterSpy = jest.spyOn(encrypterStub, "encrypt");
			const fakeAccount = makeFakeAccount();
			await sut.add(fakeAccount);
			expect(encrypterSpy).toHaveBeenCalledTimes(1);
			expect(encrypterSpy).toHaveBeenCalledWith("valid_password");
		});

		it("should use the encrypted password when adding an account", async () => {
			const { sut, addAccountRepositoryStub } = makeSut();
			const repoSpy = jest.spyOn(addAccountRepositoryStub, "add");
			const fakeAccount = makeFakeAccount();
			await sut.add(fakeAccount);
			expect(repoSpy).toHaveBeenCalledWith({
				...fakeAccount,
				password: "hashed_password",
			});
		});
		it("should throw if encrypter throws", async () => {
			const { sut, encrypterStub } = makeSut();
			jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(
				new Promise((_, reject) => reject(new Error()))
			);
			const promise = sut.add(makeFakeAccount());
			await expect(promise).rejects.toThrow();
		});
	});
	describe("loadAccountByEmailRepository", () => {
		it("should call the correct loadAccountByEmailRepository when adding an account", async () => {
			const { sut, loadAccountByEmailRepositoryStub } = makeSut();
			const loadSpy = jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			);
			await sut.add(makeFakeAccount());
			expect(loadSpy).toHaveBeenCalled();
		});
		it("should return null if email is already in use", async () => {
			const { sut, loadAccountByEmailRepositoryStub } = makeSut();
			jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			).mockImplementationOnce(() => {
				return new Promise((resolve) =>
					resolve({
						id: "any_id_2",
						name: "valid_name_2",
						email: "valid_email_2",
						password: "hashed_password_2",
					})
				);
			});
			const response = await sut.add(makeFakeAccount());
			expect(response).toBeNull();
		});
		it("should not add an account if the email is already in use", async () => {
			const {
				sut,
				loadAccountByEmailRepositoryStub,
				addAccountRepositoryStub,
			} = makeSut();

			const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
			jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			).mockImplementationOnce(() => {
				return new Promise((resolve) =>
					resolve({
						id: "any_id_2",
						name: "valid_name_2",
						email: "valid_email_2",
						password: "hashed_password_2",
					})
				);
			});
			await sut.add(makeFakeAccount());
			expect(addSpy).toHaveBeenCalledTimes(0);
		});
	});
});
