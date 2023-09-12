import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helpers";
import { IController } from "../protocols/controller";
import { IHttpRequest, IHttpResponse } from "../protocols/http";

export class SigunUpController implements IController {
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		// const { name, email, password, passwordConfirmation } = request.body;

		if (!request?.body?.name)
			return badRequest(new MissingParamError("name"));
		if (!request?.body?.email)
			return badRequest(new MissingParamError("email"));
		if (!request?.body?.password)
			return badRequest(new MissingParamError("password"));
		if (!request?.body?.passwordConfirmation)
			return badRequest(new MissingParamError("passwordConfirmation"));

		return new Promise((resolve) =>
			resolve({ statusCode: 200, body: null })
		);
	}
}
