import { badRequest, ok, serverError } from "../../helpers/http-helpers";
import {
	IController,
	IHttpRequest,
	IHttpResponse,
	IValidation,
} from "../../protocols";
import { IDbAddBatch } from "@/domain/usecases/batch/add-batch";
import { ParamInUseError } from "@/presentation/errors";

export class AddBatchController implements IController {
	constructor(
		private readonly validations: IValidation,
		private readonly dbAddBatch: IDbAddBatch
	) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const error = this.validations.validate(request.body);
			if (error) return badRequest(error);

			const { name } = request.body;
			const { accountId } = request as any;

			const wasAdded = await this.dbAddBatch.add({
				name,
				ownerId: accountId,
			});
			if (!wasAdded) return badRequest(new ParamInUseError("name"));
			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
