import { IDbAddAnimal } from "@domain/usecases/add-animal";
import { InvalidParamError } from "../errors";
import { badRequest, ok, serverError } from "../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../protocols";
import { IDbRemoveAnimal } from "@domain/usecases/remove-animal";

export class RemoveAnimalController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbRemoveAnimal: IDbRemoveAnimal
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const { animalId } = request as any;
			const sucess = await this.dbRemoveAnimal.remove(animalId);

			if (!sucess) return badRequest(new InvalidParamError("animalId"));

			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
