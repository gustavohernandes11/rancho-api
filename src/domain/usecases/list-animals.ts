import { IQueryParams } from "@/data/usecases/list-animals/db-list-animals-protocols";
import { IAnimalModel } from "@/domain/models/animals";

export interface IDbListAnimals {
	list(
		accountId: string,
		queryParams?: IQueryParams
	): Promise<IAnimalModel[] | null>;
}
