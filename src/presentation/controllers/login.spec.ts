import { IAuthenticationModel } from "../../domain/models/authentication";
import {
	IAuthentication,
	IAuthenticationResult,
} from "../../domain/usecases/authentication";
import { makeLoginValidations } from "../../main/factories/validation/make-login-validation";
import { MissingParamError } from "../errors";
import { LoginController } from "./login";

describe("Login", () => {
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
		sut: LoginController;
		authenticationStub: IAuthentication;
	}
	const makeSut = (): ISutTypes => {
		const loginValidations = makeLoginValidations();
		const authenticationStub = new DbAuthenticationStub();
		const sut = new LoginController(loginValidations, authenticationStub);
		return { sut, authenticationStub };
	};
	const makeFakeRequest = () => ({
		body: {
			email: "valid_email@gmail.com",
			password: "valid_password",
		},
	});
	describe("Validations", () => {
		it("should return 400 when no email is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle({
				body: { password: "any_password" },
			});
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("email"));
		});
		it("should return 400 when no password is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle({
				body: { email: "any_email@gmail.com" },
			});
			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("password"));
		});
	});
	describe("Authentication", () => {
		it("should call the authentication method with the correct params", async () => {
			const { sut, authenticationStub } = makeSut();
			const authSpy = jest.spyOn(authenticationStub, "auth");
			const request = makeFakeRequest();

			await sut.handle(request);

			expect(authSpy).toHaveBeenCalledTimes(1);
			expect(authSpy).toHaveBeenCalledWith({
				email: "valid_email@gmail.com",
				password: "valid_password",
			});
		});
		it("should return 500 if authentication throws", async () => {
			const { sut, authenticationStub } = makeSut();
			jest.spyOn(authenticationStub, "auth").mockImplementationOnce(
				(): never => {
					throw new Error();
				}
			);
			const result = await sut.handle(makeFakeRequest());
			expect(result.statusCode).toBe(500);
		});
		it("should return 200 with accessToken and name params in the body on success", async () => {
			const { sut } = makeSut();
			const request = makeFakeRequest();

			const response = await sut.handle(request);

			expect(response.body).toEqual({
				accessToken: "valid_acess_token",
				name: "valid_name",
			});
			expect(response.statusCode).toBe(200);
		});
	});
});
