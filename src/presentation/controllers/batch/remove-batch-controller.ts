import { notFound, ok, serverError } from "../../helpers/http-helpers";
import { IController, IHttpRequest, IHttpResponse } from "../../protocols";
import { IDbRemoveBatch } from "@/domain/usecases/batch/remove-batch";

export class RemoveBatchController implements IController {
	constructor(private readonly dbRemoveBatch: IDbRemoveBatch) {}
	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const { batchId } = request as any;

			const sucess = await this.dbRemoveBatch.remove(batchId);

			if (!sucess) return notFound();

			return ok();
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
