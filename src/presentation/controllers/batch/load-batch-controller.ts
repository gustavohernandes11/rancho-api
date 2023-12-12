import { notFound, ok, serverError } from "../../helpers/http-helpers";
import { IHttpRequest } from "@/presentation/protocols";
import { IDbLoadBatch } from "@/domain/usecases/load-batch";

export class LoadBatchController {
	constructor(private readonly dbLoadBatch: IDbLoadBatch) {}

	async handle(request: IHttpRequest) {
		try {
			const { batchId } = request as any;
			const batch = await this.dbLoadBatch.load(batchId);

			if (batch === null) return notFound();
			return ok(batch);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
