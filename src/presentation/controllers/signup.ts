import { IAddAccount } from "../../domain/usecases/add-account";
import { badRequest } from "../helpers/http-helpers";
import {
	IController,
	IValidation,
	IHttpRequest,
	IHttpResponse,
} from "../protocols";

export class SigunUpController implements IController {
	constructor(
		private readonly validation: IValidation,
		private readonly dbAddAccount: IAddAccount
	) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		const error = this.validation.validate(request.body);
		if (error) return badRequest(error);

		const sucess = this.dbAddAccount.add(request.body);

		return new Promise((resolve) =>
			resolve({ statusCode: 200, body: null })
		);
	}
}
