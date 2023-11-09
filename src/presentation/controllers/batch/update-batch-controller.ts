import { IDbUpdateBatch } from "@domain/usecases/batch/update-batch";
import { InvalidParamError } from "@presentation/errors";
import {
	badRequest,
	ok,
	serverError,
} from "@presentation/helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "@presentation/protocols";

export class UpdateBatchController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbUpdateBatch: IDbUpdateBatch
	) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const { name, ownerId } = request.body;
			const { batchId } = request as any;

			const updatedBatch = await this.dbUpdateBatch.update(batchId, {
				name,
				ownerId,
			});
			if (!updatedBatch)
				return badRequest(new InvalidParamError("batchId"));
			return ok(updatedBatch);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
