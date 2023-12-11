import { IDbAddAnimal } from "@/domain/usecases/add-animal";
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

			const {
				name,
				gender,
				age,
				code,
				maternityId,
				observation,
				paternityId,
				batchId,
			} = request.body;
			const { accountId } = request as any;

			const wasAdded = await this.dbAddAnimal.add({
				ownerId: accountId,
				name,
				gender,
				age,
				code,
				maternityId,
				observation,
				paternityId,
				batchId,
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
