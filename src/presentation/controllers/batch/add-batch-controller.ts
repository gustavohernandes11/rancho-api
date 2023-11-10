import { IDbAddAnimal } from "@/domain/usecases/add-animal";
import { InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../../protocols";
import { IDbAddBatch } from "@/domain/usecases/batch/add-batch";

export class AddBatchController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbAddBatch: IDbAddBatch
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const { name, ownerId } = request.body;

			const wasAdded = await this.dbAddBatch.add({ name, ownerId });
			if (!wasAdded) return badRequest(new InvalidParamError("ownerId"));
			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
