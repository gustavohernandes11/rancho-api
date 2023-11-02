import { IAddAccount } from "@domain/usecases/add-account";
import { IAuthentication } from "@domain/usecases/authentication";
import { EmailInUseError } from "../errors/email-in-use-error";
import {
	badRequest,
	forbidden,
	ok,
	serverError,
} from "../helpers/http-helpers";
import {
	IController,
	IValidation,
	IHttpRequest,
	IHttpResponse,
} from "../protocols";

export class SigunUpController implements IController {
	constructor(
		private readonly validation: IValidation,
		private readonly dbAddAccount: IAddAccount,
		private readonly authentication: IAuthentication
	) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validation.validate(request.body);
			if (error) return badRequest(error);

			const { email, name, password } = request.body;

			const isValid = await this.dbAddAccount.add({
				email,
				name,
				password,
			});

			if (!isValid) return forbidden(new EmailInUseError());
			const authResult = await this.authentication.auth({
				email,
				password,
			});

			return ok(authResult);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
