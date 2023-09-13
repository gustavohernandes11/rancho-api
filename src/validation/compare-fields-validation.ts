import { InvalidParamError } from "../presentation/errors/invalid-param-error";
import { IValidation } from "../presentation/protocols/validation";

export class CompareFieldsValidation implements IValidation {
	constructor(
		private readonly field: string,
		private readonly fieldToCompare: string
	) {}

	validate(input: any): any {
		if (input[this.field] !== input[this.fieldToCompare])
			return new InvalidParamError(this.fieldToCompare);
	}
}
