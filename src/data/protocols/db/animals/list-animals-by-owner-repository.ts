import { IAnimalModel } from "@/domain/models/animals";
import { IQueryParams } from "@/domain/usecases/list-animals";

export interface IListAnimalsByOwnerIdRepository {
	listAnimals(
		ownerId: string,
		queryParams?: IQueryParams
	): Promise<IAnimalModel[]>;
}
