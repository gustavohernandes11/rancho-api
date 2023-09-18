import { IAuthentication } from "../../../domain/usecases/authentication";
import { IHashComparer } from "../../protocols/criptography/hash-comparer";
import {
	IAccountModel,
	ILoadAccountByEmailRepository,
} from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication", () => {
	class HashComparerStub implements IHashComparer {
		compare(): Promise<boolean> {
			return new Promise((resolve) => resolve(true));
		}
	}

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
	interface ISutType {
		sut: IAuthentication;
		hashComparerStub: IHashComparer;
		loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
	}
	const makeSut = (): ISutType => {
		const hashComparerStub = new HashComparerStub();
		const loadAccountByEmailRepositoryStub =
			new LoadAccountByEmailRepositoryStub();

		const sut = new DbAuthentication(
			loadAccountByEmailRepositoryStub,
			hashComparerStub
		);
		return { sut, loadAccountByEmailRepositoryStub, hashComparerStub };
	};
	describe("loadAccountByEmailRepository", () => {
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
		it("should throw if HashComparer throws", async () => {
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
});
