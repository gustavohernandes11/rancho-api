import { DbLoadAccountByToken } from "./db-load-account-by-token";
import {
	AccountId,
	IDbLoadAccountByToken,
	IDecrypter,
	ILoadAccountByTokenRepository,
} from "./db-load-account-by-token-protocols";

describe("DbLoadAccountByToken", () => {
	class LoadAccountByTokenRepositoryStub
		implements ILoadAccountByTokenRepository
	{
		async loadByToken(token: string): Promise<AccountId | null> {
			if (token === "valid_token") {
				return { id: "account_id" };
			} else {
				return null;
			}
		}
	}

	class DecrypterStub implements IDecrypter {
		async decrypt(value: string): Promise<string> {
			return "valid_token";
		}
	}

	type SutTypes = {
		sut: IDbLoadAccountByToken;
		loadAccountByTokenRepositoryStub: LoadAccountByTokenRepositoryStub;
		decrypter: DecrypterStub;
	};

	const makeSut = (): SutTypes => {
		const loadAccountByTokenRepositoryStub =
			new LoadAccountByTokenRepositoryStub();
		const decrypter = new DecrypterStub();
		const sut = new DbLoadAccountByToken(
			decrypter,
			loadAccountByTokenRepositoryStub
		);
		return {
			sut,
			decrypter,
			loadAccountByTokenRepositoryStub,
		};
	};

	describe("load", () => {
		it("should call loadAccountByTokenRepository with the correct token", async () => {
			const { sut, loadAccountByTokenRepositoryStub } = makeSut();
			const loadSpy = jest.spyOn(
				loadAccountByTokenRepositoryStub,
				"loadByToken"
			);

			const fakeToken = "valid_token";
			await sut.load(fakeToken);

			expect(loadSpy).toHaveBeenCalledWith(fakeToken, undefined);
		});

		it("should return the account ID if the token is valid", async () => {
			const { sut } = makeSut();
			const fakeToken = "valid_token";
			const result = await sut.load(fakeToken);

			expect(result?.id).toBe("account_id");
		});

		it("should return null if the token is invalid", async () => {
			const { sut, loadAccountByTokenRepositoryStub } = makeSut();
			jest.spyOn(
				loadAccountByTokenRepositoryStub,
				"loadByToken"
			).mockReturnValueOnce(Promise.resolve(null));

			const fakeToken = "invalid_token";
			const result = await sut.load(fakeToken);

			expect(result).toBeNull();
		});
	});
});
