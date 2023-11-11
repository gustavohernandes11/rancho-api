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

			const { name, age, code, maternityId, observation, paternityId } =
				request.body;
			const { accountId } = request as any;

			const wasAdded = await this.dbAddAnimal.add({
				name,
				ownerId: accountId,
				age,
				code,
				maternityId,
				observation,
				paternityId,
			});

			if (!wasAdded)
				return badRequest(
					new Error("Was not possible to insert in the database")
				);
			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
