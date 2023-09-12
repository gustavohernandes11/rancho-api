import { RequiredFieldValidator } from "../../validation/required-field-validation";
import { ValidationComposite } from "../../validation/validation-composite";
import { IHttpRequest } from "../protocols/http";
import { SigunUpController } from "./signup";

describe("Signup Controller", () => {
	interface ISutTypes {
		sut: SigunUpController;
	}
	const makeSut = (): ISutTypes => {
		const validations = [
			new RequiredFieldValidator("name"),
			new RequiredFieldValidator("email"),
			new RequiredFieldValidator("password"),
			new RequiredFieldValidator("passwordConfirmation"),
		];
		const singUpValidationComposite = new ValidationComposite(validations);

		const sut = new SigunUpController(singUpValidationComposite);
		return { sut };
	};
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
	});
});
