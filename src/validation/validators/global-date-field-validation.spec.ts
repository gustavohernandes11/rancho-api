import { InvalidParamError } from "@presentation/errors";
import { InvalidDateFormatError } from "@presentation/errors/invalid-date-format-error";
import { GlobalDateFormatValidation } from "./global-date-field-validation";

describe("UtcDateValidation", () => {
	interface SutTypes {
		sut: GlobalDateFormatValidation;
	}

	const makeSut = (dateField: string): SutTypes => {
		const sut = new GlobalDateFormatValidation(dateField);
		return {
			sut,
		};
	};

	it("should return an invalid param error if the date field is not a string", () => {
		const sut = new GlobalDateFormatValidation("date");
		const input = { date: 123 };
		const error = sut.validate(input);
		expect(error).toEqual(new InvalidParamError("date"));
	});

	it("should throw an InvalidDateFormatError if the date is not in ISO format", () => {
		const sut = new GlobalDateFormatValidation("date");
		const input = { date: new Date().toISOString() };
		const error = sut.validate(input);
		expect(error).toBeUndefined();
	});
});
