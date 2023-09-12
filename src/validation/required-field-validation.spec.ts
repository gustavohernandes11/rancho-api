import { MissingParamError } from "../presentation/errors/missing-param-error";
import { RequiredFieldValidator } from "./required-field-validation";

describe("Required field validator", () => {
	it("should throw an missing param error if the required field is not provided", () => {
		const sut = new RequiredFieldValidator("name");
		const error = sut.validate({});
		expect(error).toEqual(new MissingParamError("name"));
	});
	it("should return nothing if the correct param is passed", () => {
		const sut = new RequiredFieldValidator("name");
		const response = sut.validate({ name: "any_name" });
		expect(response).toBeUndefined();
	});
});
