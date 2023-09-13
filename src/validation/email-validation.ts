import { InvalidParamError } from "../presentation/errors";
import { IEmailValidator, IValidation } from "../presentation/protocols";

export class EmailValidation implements IValidation {
	constructor(
		private readonly email: string,
		private readonly emailValidator: IEmailValidator
	) {}

	validate(input: any): any {
		if (!this.emailValidator.isValid(input[this.email]))
			return new InvalidParamError(`${this.email}`);
	}
}
