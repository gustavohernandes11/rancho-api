import {
	InvalidParamError,
	MissingParamError,
	EmailInUseError,
} from "../errors";
import { IHttpRequest } from "../protocols/";
import { SigunUpController } from "./signup";
import { makeSignUpValidation } from "../../main/factories/validation/make-signup-validation";
import {
	IAddAccount,
	IAddAccountModel,
} from "../../domain/usecases/add-account";
import {
	IAuthentication,
	IAuthenticationResult,
} from "../../domain/usecases/authentication";
import { IAuthenticationModel } from "../../domain/models/authentication";

describe("Signup Controller", () => {
	class DbAddAccountStub implements IAddAccount {
		async add(account: IAddAccountModel): Promise<boolean> {
			return new Promise((resolve) => resolve(true));
		}
	}
	class DbAuthenticationStub implements IAuthentication {
		auth(account: IAuthenticationModel): Promise<IAuthenticationResult> {
			return new Promise((resolve) =>
				resolve({
					accessToken: "valid_acess_token",
					name: "valid_name",
				})
			);
		}
	}
	interface ISutTypes {
		sut: SigunUpController;
		dbAddAccountStub: IAddAccount;
		authenticationStub: IAuthentication;
	}
	const makeSut = (): ISutTypes => {
		const signupValidations = makeSignUpValidation();
		const dbAddAccountStub = new DbAddAccountStub();
		const authenticationStub = new DbAuthenticationStub();
		const sut = new SigunUpController(
			signupValidations,
			dbAddAccountStub,
			authenticationStub
		);
		return { sut, dbAddAccountStub, authenticationStub };
	};
	const makeFakeRequest = () => ({
		body: {
			name: "valid_name",
			email: "valid_email@gmail.com",
			password: "valid_password",
			passwordConfirmation: "valid_password",
		},
	});

	describe("Validation", () => {
		it("should return 400 if name is not provided", async () => {
			const { sut } = makeSut();
			const httpRequest: IHttpRequest = {
				body: {
					email: "valid_email@gmail.com",
					password: "valid_password",
					passwordConfirmation: "valid_password",
				},
			};
			const response = await sut.handle(httpRequest);
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("name"));
		});
		it("should return 400 if email is not provided", async () => {
			const { sut } = makeSut();
			const httpRequest: IHttpRequest = {
				body: {
					name: "valid_name@gmail.com",
					password: "valid_password",
					passwordConfirmation: "valid_password",
				},
			};
			const response = await sut.handle(httpRequest);
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("email"));
		});
		it("should return 400 if password is not provided", async () => {
			const { sut } = makeSut();
			const httpRequest: IHttpRequest = {
				body: {
					name: "valid_name@gmail.com",
					email: "valid_email@gmail.com",
					passwordConfirmation: "valid_password",
				},
			};
			const response = await sut.handle(httpRequest);
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("password"));
		});
		it("should return 400 if passwordConfirmation is not provided", async () => {
			const { sut } = makeSut();
			const httpRequest: IHttpRequest = {
				body: {
					name: "valid_name@gmail.com",
					email: "valid_email@gmail.com",
					password: "valid_password",
				},
			};
			const response = await sut.handle(httpRequest);
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(
				new MissingParamError("passwordConfirmation")
			);
		});
		it("should return 400 if the passwordConfirmation is not equal to the password", async () => {
			const { sut } = makeSut();
			const httpRequest: IHttpRequest = {
				body: {
					name: "valid_name@gmail.com",
					email: "valid_email@gmail.com",
					password: "valid_password",
					passwordConfirmation: "DIFFERENT_PASSWORD_CONFIRMATION",
				},
			};
			const response = await sut.handle(httpRequest);
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(
				new InvalidParamError("passwordConfirmation")
			);
		});
		it("should return 400 if the email provided is not valid", async () => {
			const { sut } = makeSut();
			const httpRequest: IHttpRequest = {
				body: {
					name: "valid_name@gmail.com",
					email: "INVALID_EMAIL",
					password: "valid_password",
					passwordConfirmation: "valid_password",
				},
			};
			const response = await sut.handle(httpRequest);
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new InvalidParamError("email"));
		});
	});
	describe("DbAddAccount", () => {
		it("should call the DbAddAccount with correct params", () => {
			const { sut, dbAddAccountStub } = makeSut();
			const addSpy = jest.spyOn(dbAddAccountStub, "add");
			sut.handle(makeFakeRequest());
			expect(addSpy).toHaveBeenCalledTimes(1);
			expect(addSpy).toHaveBeenCalledWith({
				name: "valid_name",
				email: "valid_email@gmail.com",
				password: "valid_password",
			});
		});
		it("should return 500 if the DbAddAccount throws", async () => {
			const { sut, dbAddAccountStub } = makeSut();
			jest.spyOn(dbAddAccountStub, "add").mockImplementationOnce(() => {
				throw new Error();
			});
			const response = await sut.handle(makeFakeRequest());
			expect(response.statusCode).toBe(500);
		});
		it("should return 403 (forbidden) if the DbAddAccount failed to add an account", async () => {
			const { sut, dbAddAccountStub } = makeSut();
			jest.spyOn(dbAddAccountStub, "add").mockReturnValueOnce(
				new Promise((resolve) => resolve(false))
			);
			const response = await sut.handle(makeFakeRequest());
			expect(response.statusCode).toBe(403);
			expect(response.body).toEqual(new EmailInUseError());
		});
		it("should return 200 if correct data is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle(makeFakeRequest());
			expect(response.statusCode).toBe(200);
		});
	});
	describe("Authentication", () => {
		it("should return 500 if Authentication throws", async () => {
			const { sut, authenticationStub } = makeSut();
			jest.spyOn(authenticationStub, "auth").mockImplementationOnce(
				() => {
					throw new Error();
				}
			);
			const response = await sut.handle(makeFakeRequest());
			expect(response.statusCode).toBe(500);
		});
		it("should call the correct authentication method", async () => {
			const { sut, authenticationStub } = makeSut();
			const authSpy = jest.spyOn(authenticationStub, "auth");
			await sut.handle(makeFakeRequest());

			expect(authSpy).toHaveBeenCalledWith({
				email: "valid_email@gmail.com",
				password: "valid_password",
			});
		});
		it("should return 200 with authentication (name and accessToken)", async () => {
			const { sut } = makeSut();
			const response = await sut.handle(makeFakeRequest());

			expect(response.body).toEqual({
				accessToken: "valid_acess_token",
				name: "valid_name",
			});
			expect(response.statusCode).toBe(200);
		});
	});
});
