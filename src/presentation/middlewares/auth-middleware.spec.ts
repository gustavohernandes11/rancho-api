import {
	AccountId,
	ILoadAccountByTokenRepository,
} from "@data/protocols/db/accounts";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http-helpers";
import { AuthMiddleware } from "./auth-middleware";

class LoadAccountByTokenRepositoryStub
	implements ILoadAccountByTokenRepository
{
	async loadByToken(token: string): Promise<AccountId | null> {
		return {
			id: "any_id",
		};
	}
}

interface ISutTypes {
	loadAccountByTokenRepositoryStub: LoadAccountByTokenRepositoryStub;
	sut: AuthMiddleware;
}

const makeSut = (): ISutTypes => {
	const loadAccountByTokenRepositoryStub =
		new LoadAccountByTokenRepositoryStub();

	return {
		loadAccountByTokenRepositoryStub,
		sut: new AuthMiddleware(loadAccountByTokenRepositoryStub),
	};
};

const makeFakeRequest = () => ({
	accessToken: "any_token",
});

describe("Auth Middleware", () => {
	it("should return 403 if no x-access-token is provided on request", async () => {
		const { sut } = makeSut();
		const response = await sut.handle({});

		expect(response.statusCode).toBe(403);
	});

	it("should call the correct loadAccountByTokenRepository", () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();
		const loadByTokenSpy = jest.spyOn(
			loadAccountByTokenRepositoryStub,
			"loadByToken"
		);
		const request = makeFakeRequest();
		sut.handle(request);

		expect(loadByTokenSpy).toHaveBeenCalledWith(
			request.accessToken,
			undefined
		);
	});
	it("should return 200 if the token is valid", async () => {
		const { sut } = makeSut();
		const response = await sut.handle(makeFakeRequest());
		expect(response.statusCode).toBe(200);
	});
	it("should return the account id on success", async () => {
		const { sut } = makeSut();
		const response = await sut.handle(makeFakeRequest());
		expect(response.body).toEqual({ accountId: "any_id" });
	});

	it("should return 403 if loadAccountByToken returns null", async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();
		jest.spyOn(
			loadAccountByTokenRepositoryStub,
			"loadByToken"
		).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

		const response = await sut.handle(makeFakeRequest());
		expect(response.statusCode).toBe(403);
		expect(response).toEqual(forbidden(new AccessDeniedError()));
	});
	it("should return 500 if loadAccountByTokenRepository throws", async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();

		jest.spyOn(
			loadAccountByTokenRepositoryStub,
			"loadByToken"
		).mockImplementationOnce(() => {
			throw new Error();
		});

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(500);
	});
});
