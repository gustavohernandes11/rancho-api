import { IDbLoadAnimal } from "@/data/usecases/load-animal/db-load-animal-protocols";
import { InvalidParamError } from "../../errors";
import {
	badRequest,
	notFound,
	ok,
	serverError,
} from "../../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../../protocols";
import { IDbRemoveAnimal } from "@/domain/usecases/remove-animal";

export class RemoveAnimalController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbRemoveAnimal: IDbRemoveAnimal,
		private readonly dbLoadAnimal: IDbLoadAnimal
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const { animalId, accountId } = request as any;

			const animal = await this.dbLoadAnimal.load(animalId);

			if (!animal) return notFound();

			const sucess = await this.dbRemoveAnimal.remove(
				animalId,
				accountId
			);

			if (!sucess) return badRequest(new InvalidParamError("animalId"));

			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
