import { IDbUpdateManyAnimals } from "@/domain/usecases/update-many-animals";
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

export class UpdateManyAnimalsController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbUpdateManyAnimals: IDbUpdateManyAnimals
	) {}

	//[TODO] simplify
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			if (!Array.isArray(request.body)) {
				return badRequest(
					new Error("Body should be provided as array")
				);
			}
			const errors = [];
			for (const animal of request.body) {
				const error = this.validations.validate(animal.props);

				if (error) {
					errors.push(error);
				}
			}
			if (errors.length > 0) {
				return badRequest(errors[0]);
			}

			let animals = request.body;
			const { accountId } = request as any;

			animals = animals.map((al: any) =>
				Object.assign({ props: { ownerId: accountId } }, al)
			);

			const updatedAnimals = await this.dbUpdateManyAnimals.updateMany(
				animals
			);
			if (updatedAnimals.find((el) => el === null))
				return badRequest(
					new Error("Not all the animals could be updated.")
				);
			return ok(updatedAnimals);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
