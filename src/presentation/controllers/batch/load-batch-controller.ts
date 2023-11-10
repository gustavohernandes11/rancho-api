import {
	noContent,
	notFound,
	ok,
	serverError,
} from "../../helpers/http-helpers";
import { IController, IHttpRequest } from "@/presentation/protocols";
import { IDbListAnimalsByBatch } from "@/domain/usecases/batch/list-animals-by-batch";

export class LoadBatchController implements IController {
	constructor(private readonly dbListAnimalsByBatch: IDbListAnimalsByBatch) {}

	async handle(request: IHttpRequest) {
		try {
			const { batchId } = request as any;
			const batches = await this.dbListAnimalsByBatch.list(batchId);

			if (batches?.length === 0) return noContent();

			if (batches === null) return notFound();
			return ok(batches);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
