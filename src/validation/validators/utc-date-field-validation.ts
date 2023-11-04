import { InvalidParamError } from "@presentation/errors";
import { InvalidUTCFormatError } from "@presentation/errors/invalid-utc-format-error";
import { IValidation } from "@presentation/protocols";

export class UtcDateFormatValidation implements IValidation {
	constructor(private readonly dateField: string) {}

	validate(input: any): any {
		const inputValue = input[this.dateField];

		if (typeof inputValue !== "string") {
			return new InvalidParamError(this.dateField);
		}

		const utcDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
		if (!utcDatePattern.test(inputValue)) {
			return new InvalidUTCFormatError(this.dateField);
		}
	}
}
