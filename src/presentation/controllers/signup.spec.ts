import {
	CompareFieldsValidation,
	EmailValidation,
	RequiredFieldValidation,
	ValidationComposite,
} from "../../validation/validators";
import { IEmailValidator } from "../../validation/protocols/email-validator";
import { InvalidParamError, MissingParamError } from "../errors";
import { IHttpRequest } from "../protocols/";
import { SigunUpController } from "./signup";

describe("Signup Controller", () => {
	class EmailValidatorStub implements IEmailValidator {
		isValid = (email: string): boolean => true;
	}
	interface ISutTypes {
		sut: SigunUpController;
		emailValidatorStub: IEmailValidator;
	}
	const makeSut = (): ISutTypes => {
		const emailValidatorStub = new EmailValidatorStub();

		const makeSignUpValidation = () => {
			const validations = [
				new RequiredFieldValidation("name"),
				new RequiredFieldValidation("email"),
				new RequiredFieldValidation("password"),
				new RequiredFieldValidation("passwordConfirmation"),
				new CompareFieldsValidation("password", "passwordConfirmation"),
				new EmailValidation("email", emailValidatorStub),
			];

			return new ValidationComposite(validations);
		};

		const singUpValidationComposite = makeSignUpValidation();
		const sut = new SigunUpController(singUpValidationComposite);
		return { sut, emailValidatorStub };
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
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
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
