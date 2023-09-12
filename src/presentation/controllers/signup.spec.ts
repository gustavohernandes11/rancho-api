import { RequiredFieldValidator } from "../../validation/required-field-validation";
import { ValidationComposite } from "../../validation/validation-composite";
import { IHttpRequest } from "../protocols/http";
import { SigunUpController } from "./signup";

describe("Signup Controller", () => {
	it("should return 400 if name is not provided", async () => {
		const validations = [new RequiredFieldValidator("name")];
		const validationStub = new ValidationComposite(validations);

		const sut = new SigunUpController(validationStub);
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
		const validations = [new RequiredFieldValidator("email")];
		const validationStub = new ValidationComposite(validations);

		const sut = new SigunUpController(validationStub);
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
		const validations = [new RequiredFieldValidator("password")];
		const validationStub = new ValidationComposite(validations);

		const sut = new SigunUpController(validationStub);
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
		const validations = [
			new RequiredFieldValidator("passwordConfirmation"),
		];
		const validationStub = new ValidationComposite(validations);

		const sut = new SigunUpController(validationStub);
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
