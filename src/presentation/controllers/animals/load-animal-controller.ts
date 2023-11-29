import { notFound, ok, serverError } from "../../helpers/http-helpers";
import { IHttpRequest } from "@/presentation/protocols";
import { IDbLoadAnimal } from "@/domain/usecases/load-animal";

export class LoadAnimalController {
	constructor(private readonly dbLoadAnimal: IDbLoadAnimal) {}

	async handle(request: IHttpRequest) {
		try {
			const { animalId } = request as any;
			const animal = await this.dbLoadAnimal.load(animalId);

			if (animal === null) return notFound();
			return ok(animal);
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
