import { IAddAccountRepository } from "../../data/usecases/db-add-account-protocols";
import { badRequest } from "../helpers/http-helpers";
import {
	IController,
	IValidation,
	IHttpRequest,
	IHttpResponse,
} from "../protocols";

export class SigunUpController implements IController {
	constructor(
		private readonly validation: IValidation
	) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		const error = this.validation.validate(request.body);
		if (error) return badRequest(error);

		return new Promise((resolve) =>
			resolve({ statusCode: 200, body: null })
		);
	}
}
