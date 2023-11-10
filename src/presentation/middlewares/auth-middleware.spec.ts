import { AccountId } from "@/data/protocols/db/accounts";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http-helpers";
import { AuthMiddleware } from "./auth-middleware";
import { IDbLoadAccountByToken } from "@/domain/usecases/load-account-by-token";

class DbLoadAccountByTokenStub implements IDbLoadAccountByToken {
	async load(token: string): Promise<AccountId | null> {
		return {
			id: "any_id",
		};
	}
}

interface ISutTypes {
	dbLoadAccountByToken: DbLoadAccountByTokenStub;
	sut: AuthMiddleware;
}

const makeSut = (): ISutTypes => {
	const dbLoadAccountByToken = new DbLoadAccountByTokenStub();

	return {
		dbLoadAccountByToken,
		sut: new AuthMiddleware(dbLoadAccountByToken),
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

	it("should call the correct dbLoadAccountByToken", () => {
		const { sut, dbLoadAccountByToken } = makeSut();
		const loadSpy = jest.spyOn(dbLoadAccountByToken, "load");
		const request = makeFakeRequest();
		sut.handle(request);

		expect(loadSpy).toHaveBeenCalledWith(request.accessToken, undefined);
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

	it("should return 403 if dbLoadAccountByToken returns null", async () => {
		const { sut, dbLoadAccountByToken } = makeSut();
		jest.spyOn(dbLoadAccountByToken, "load").mockReturnValueOnce(
			new Promise((resolve) => resolve(null))
		);

		const response = await sut.handle(makeFakeRequest());
		expect(response.statusCode).toBe(403);
		expect(response).toEqual(forbidden(new AccessDeniedError()));
	});
	it("should return 500 if dbLoadAccountByToken throws", async () => {
		const { sut, dbLoadAccountByToken } = makeSut();

		jest.spyOn(dbLoadAccountByToken, "load").mockImplementationOnce(() => {
			throw new Error();
		});

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(500);
	});
});
