import { IAuthentication } from "../../domain/usecases/authentication";
import { badRequest, ok, serverError } from "../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../protocols";

export class LoginController implements IController {
	constructor(
		private readonly validation: IValidation,
		private readonly authentication: IAuthentication
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validation.validate(request.body);
			if (error) return badRequest(error);

			const { email, password } = request.body;

			const authResult = await this.authentication.auth({
				email,
				password,
			});

			return ok(authResult);
		} catch (error) {
			return serverError();
		}
	}
}
