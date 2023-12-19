import { IAnimalModel } from "@/domain/models/animals";

export type IQueryParams = {
	search?: string;
};

export interface IDbListAnimals {
	list(
		accountId: string,
		queryParams?: IQueryParams
	): Promise<IAnimalModel[] | null>;
}
