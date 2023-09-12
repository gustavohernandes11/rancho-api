import { MissingParamError } from "../presentation/errors/missing-param-error";
import { IValidation } from "../presentation/protocols/validation";

export class RequiredFieldValidation implements IValidation {
	constructor(private readonly field: string) {}

	validate(input: any): any {
		if (!input[this.field]) return new MissingParamError(this.field);
	}
}
