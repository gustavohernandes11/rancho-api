import { CompareFieldsValidation } from "../../validation/compare-fields-validation";
import { RequiredFieldValidation } from "../../validation/required-field-validation";
import { ValidationComposite } from "../../validation/validation-composite";
import { IHttpRequest } from "../protocols/http";
import { SigunUpController } from "./signup";

describe("Signup Controller", () => {
	interface ISutTypes {
		sut: SigunUpController;
	}
	const makeSignUpValidation = () => {
		const validations = [
			new RequiredFieldValidation("name"),
			new RequiredFieldValidation("email"),
			new RequiredFieldValidation("password"),
			new RequiredFieldValidation("passwordConfirmation"),
			new CompareFieldsValidation("password", "passwordConfirmation"),
		];

		return new ValidationComposite(validations);
	};
	const makeSut = (): ISutTypes => {
		const singUpValidationComposite = makeSignUpValidation();
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
	});
});
