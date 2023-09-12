import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helpers";
import { IController } from "../protocols/controller";
import { IHttpRequest, IHttpResponse } from "../protocols/http";
import { IValidation } from "../protocols/validation";

export class SigunUpController implements IController {
	constructor(private readonly validation: IValidation) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		const error = this.validation.validate(request.body);
		if (error) return badRequest(error);

		return new Promise((resolve) =>
			resolve({ statusCode: 200, body: null })
		);
	}
}
