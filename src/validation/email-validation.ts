import { InvalidParamError } from "../presentation/errors/invalid-param-error";
import { IEmailValidator } from "../presentation/protocols/email-validator";
import { IValidation } from "../presentation/protocols/validation";

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
