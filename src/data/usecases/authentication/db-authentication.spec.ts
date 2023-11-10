import { IAuthentication } from "@/domain/usecases/authentication";
import { IEncrypter } from "../../protocols/criptography/encrypter";
import { IHashComparer } from "../../protocols/criptography/hash-comparer";
import { IUpdateAccessTokenRepository } from "../../protocols/db/accounts/update-access-token-repository";
import {
	IAccountModel,
	ILoadAccountByEmailRepository,
} from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication", () => {
	class LoadAccountByEmailRepositoryStub
		implements ILoadAccountByEmailRepository
	{
		loadByEmail(email: string): Promise<IAccountModel | null> {
			return new Promise((resolve) =>
				resolve({
					email: "any_email",
					id: "any_id",
					name: "any_name",
					password: "hashed_password",
				})
			);
		}
	}
	class HashComparerStub implements IHashComparer {
		compare(): Promise<boolean> {
			return new Promise((resolve) => resolve(true));
		}
	}
	class EncrypterStub implements IEncrypter {
		encrypt(plaintext: string): Promise<string> {
			return new Promise((resolve) => resolve("encrypted_text"));
		}
	}
	class UpdateAccessTokenRepositoryStub
		implements IUpdateAccessTokenRepository
	{
		async updateAccessToken(id: string, token: string): Promise<void> {}
	}
	interface ISutType {
		sut: IAuthentication;
		hashComparerStub: IHashComparer;
		loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
		encrypter: IEncrypter;
		updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
	}
	const makeSut = (): ISutType => {
		const hashComparerStub = new HashComparerStub();
		const loadAccountByEmailRepositoryStub =
			new LoadAccountByEmailRepositoryStub();

		const encrypter = new EncrypterStub();
		const updateAccessTokenRepositoryStub =
			new UpdateAccessTokenRepositoryStub();

		const sut = new DbAuthentication(
			loadAccountByEmailRepositoryStub,
			hashComparerStub,
			encrypter,
			updateAccessTokenRepositoryStub
		);

		return {
			sut,
			loadAccountByEmailRepositoryStub,
			hashComparerStub,
			encrypter,
			updateAccessTokenRepositoryStub,
		};
	};
	describe("LoadAccountByEmailRepository", () => {
		it("should call the correct loadAccountByEmailRepository method", async () => {
			const { sut, loadAccountByEmailRepositoryStub } = makeSut();
			const loadSpy = jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			);

			await sut.auth({ email: "any_email", password: "any_password" });

			expect(loadSpy).toHaveBeenCalledTimes(1);
			expect(loadSpy).toHaveBeenCalledWith("any_email");
		});
		it("should call loadAccountByEmailRepository with correct email", async () => {
			const { sut, loadAccountByEmailRepositoryStub } = makeSut();
			const loadSpy = jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			);

			await sut.auth({ email: "any_email", password: "any_password" });

			expect(loadSpy).toHaveBeenCalledWith("any_email");
		});
		it("should return null if account wasn't found", async () => {
			const { sut, loadAccountByEmailRepositoryStub } = makeSut();
			jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

			const response = await sut.auth({
				email: "any_email",
				password: "any_password",
			});

			expect(response).toBeNull();
		});
		it("should throw if loadAccountByEmailRepository throws", async () => {
			const { sut, loadAccountByEmailRepositoryStub } = makeSut();
			jest.spyOn(
				loadAccountByEmailRepositoryStub,
				"loadByEmail"
			).mockImplementationOnce((): never => {
				throw new Error();
			});

			const promise = sut.auth({
				email: "any_email",
				password: "any_password",
			});
			expect(promise).rejects.toThrow();
		});
	});
	describe("HashComparer", () => {
		it("should compare the passwords using hash comparer", async () => {
			const { sut, hashComparerStub } = makeSut();
			const comparerSpy = jest.spyOn(hashComparerStub, "compare");

			await sut.auth({ email: "any_email", password: "any_password" });

			expect(comparerSpy).toHaveBeenCalledTimes(1);
			expect(comparerSpy).toHaveBeenCalledWith(
				"any_password",
				"hashed_password"
			);
		});
		it("should return null if the password is not validate by comparison", async () => {
			const { sut, hashComparerStub } = makeSut();
			jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(
				new Promise((resolve) => resolve(false))
			);

			const response = await sut.auth({
				email: "any_email",
				password: "any_password",
			});

			expect(response).toBeNull();
		});

		it("should call hash comparer with correct parameters", async () => {
			const { sut, hashComparerStub } = makeSut();
			const comparerSpy = jest.spyOn(hashComparerStub, "compare");

			await sut.auth({ email: "any_email", password: "any_password" });

			expect(comparerSpy).toHaveBeenCalledWith(
				"any_password",
				"hashed_password"
			);
		});
		it("should throw if hashComparer throws", async () => {
			const { sut, hashComparerStub } = makeSut();
			jest.spyOn(hashComparerStub, "compare").mockImplementationOnce(
				(): never => {
					throw new Error();
				}
			);

			const promise = sut.auth({
				email: "any_email",
				password: "any_password",
			});
			expect(promise).rejects.toThrow();
		});
	});
	describe("Encrypter", () => {
		it("should call encrypter with correct parameters", async () => {
			const { sut, encrypter } = makeSut();
			const encryptSpy = jest.spyOn(encrypter, "encrypt");

			await sut.auth({
				email: "any_email",
				password: "any_password",
			});

			expect(encryptSpy).toHaveBeenCalledWith("any_id");
		});
		it("should throw if encrypter throws", async () => {
			const { sut, encrypter } = makeSut();
			jest.spyOn(encrypter, "encrypt").mockImplementationOnce(
				(): never => {
					throw new Error();
				}
			);

			const promise = sut.auth({
				email: "any_email",
				password: "any_password",
			});
			expect(promise).rejects.toThrow();
		});
		it("should return the correct accessToken from encrypter and account name", async () => {
			const { sut } = makeSut();

			const response = await sut.auth({
				email: "any_email",
				password: "any_password",
			});

			expect(response).toEqual({
				name: "any_name",
				accessToken: "encrypted_text",
			});
		});
	});
	describe("UpdateAccessTokenRepository", () => {
		it("should throw if updateAccessTokenRepositoryStub throws", async () => {
			const { sut, updateAccessTokenRepositoryStub } = makeSut();
			jest.spyOn(
				updateAccessTokenRepositoryStub,
				"updateAccessToken"
			).mockImplementationOnce((): never => {
				throw new Error();
			});

			const promise = sut.auth({
				email: "any_email",
				password: "any_password",
			});
			expect(promise).rejects.toThrow();
		});
		it("should call updateAccessTokenRepositoryStub method when correct data is provided", async () => {
			const { sut, updateAccessTokenRepositoryStub } = makeSut();
			const updateTokenSpy = jest.spyOn(
				updateAccessTokenRepositoryStub,
				"updateAccessToken"
			);

			await sut.auth({ email: "any_email", password: "any_password" });

			expect(updateTokenSpy).toHaveBeenCalledTimes(1);
			expect(updateTokenSpy).toHaveBeenCalledWith(
				"any_id",
				"encrypted_text"
			);
		});
	});
});
