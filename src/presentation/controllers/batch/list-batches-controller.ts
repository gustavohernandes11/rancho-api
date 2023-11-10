import { noContent, ok, serverError } from "../../helpers/http-helpers";
import { IController, IHttpRequest } from "@/presentation/protocols";
import { IDbListBatches } from "@/domain/usecases/batch/list-batches";

export class ListBatchesController implements IController {
	constructor(private readonly dbListBatches: IDbListBatches) {}

	async handle(request: IHttpRequest) {
		try {
			const { accountId } = request as any;
			const batches = await this.dbListBatches.listBatches(accountId);

			if (batches?.length === 0) return noContent();
			return ok(batches);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
