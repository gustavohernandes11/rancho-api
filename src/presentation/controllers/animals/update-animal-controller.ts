import { IDbUpdateAnimal } from "@/data/usecases/update-animal/db-update-animal-protocols";
import { InvalidParamError } from "@/presentation/errors";
import {
	badRequest,
	ok,
	serverError,
} from "@/presentation/helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "@/presentation/protocols";

export class UpdateAnimalController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbUpdateAnimal: IDbUpdateAnimal
	) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const {
				name,
				age,
				batchId,
				code,
				maternityId,
				paternityId,
				observation,
			} = request.body;
			const { animalId, accountId } = request as any;

			const updatedAnimal = await this.dbUpdateAnimal.update(animalId, {
				name,
				ownerId: accountId,
				age,
				batchId,
				code,
				paternityId,
				maternityId,
				observation,
			});
			if (!updatedAnimal)
				return badRequest(new InvalidParamError("animalId"));
			return ok(updatedAnimal);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
