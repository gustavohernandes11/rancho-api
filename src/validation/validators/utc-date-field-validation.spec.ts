import { InvalidParamError } from "@presentation/errors";
import { InvalidUTCFormatError } from "@presentation/errors/invalid-utc-format-error";
import { UtcDateFormatValidation } from "./utc-date-field-validation";

describe("UtcDateValidation", () => {
	interface SutTypes {
		sut: UtcDateFormatValidation;
	}

	const makeSut = (dateField: string): SutTypes => {
		const sut = new UtcDateFormatValidation(dateField);
		return {
			sut,
		};
	};

	it("should return an invalid param error if the date field is not a string", () => {
		const { sut } = makeSut("date");
		const input = { date: 123 };
		const error = sut.validate(input);
		expect(error).toEqual(new InvalidParamError("date"));
	});

	it("should return an invalid UTC format error if the date is not in UTC format", () => {
		const { sut } = makeSut("date");
		const input = { date: "2023-11-04T14:30:00Z123" };
		const error = sut.validate(input);
		expect(error).toEqual(new InvalidUTCFormatError("date"));
	});

	it("should return nothing if the date is a valid UTC date", () => {
		const { sut } = makeSut("date");
		const input = { date: "2023-11-04T14:30:00.123Z" };
		const response = sut.validate(input);
		expect(response).toBeUndefined();
	});
});
