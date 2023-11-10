import { IDbAddAnimal } from "@/domain/usecases/add-animal";
import { InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../../protocols";

export class AddAnimalController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbAddAnimal: IDbAddAnimal
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const { name, ownerId, age } = request.body;

			const wasAdded = await this.dbAddAnimal.add({ name, ownerId, age });
			if (!wasAdded) return badRequest(new InvalidParamError("ownerId"));
			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
