import { IAnimalModel } from "@/domain/models/animals";

export type IQueryParams = {
	search?: string;
};

export interface IListAnimalsByOwnerIdRepository {
	listAnimals(
		ownerId: string,
		queryParams?: IQueryParams
	): Promise<IAnimalModel[]>;
}
