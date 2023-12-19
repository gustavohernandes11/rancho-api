import { IDbListAnimals } from "@/data/usecases/list-animals/db-list-animals-protocols";
import { noContent, ok, serverError } from "../../helpers/http-helpers";
import { IHttpRequest } from "@/presentation/protocols";

export class ListAnimalsController {
	constructor(private readonly dbListAnimals: IDbListAnimals) {}

	async handle(request: IHttpRequest) {
		try {
			const { accountId, query } = request as any;

			const animals = await this.dbListAnimals.list(accountId, query);

			if (animals?.length === 0) return noContent();
			return ok(animals);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
