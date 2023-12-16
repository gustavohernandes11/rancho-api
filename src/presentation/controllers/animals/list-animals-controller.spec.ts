import { ListAnimalsController } from "./list-animals-controller";
import { IDbListAnimals } from "@/domain/usecases/list-animals";
import { IAnimalModel } from "@/domain/models/animals";
import { noContent } from "@/presentation/helpers/http-helpers";

const mockDate = new Date().toISOString();
export const mockAnimalModel = (override?: any): IAnimalModel => {
	return Object.assign(
		{
			id: "any_id",
			name: "any_name",
			ownerId: "any_owner_id",
			gender: "F",
			age: mockDate,
		},
		override || {}
	) as IAnimalModel;
};

describe("ListAnimalsController", () => {
	class DbListAnimalsStub implements IDbListAnimals {
		list(accountId: string): Promise<IAnimalModel[] | null> {
			return Promise.resolve([
				mockAnimalModel({ id: "1" }),
				mockAnimalModel({ id: "2" }),
				mockAnimalModel({ id: "3" }),
			]);
		}
	}

	interface ISutTypes {
		sut: ListAnimalsController;
		listAnimalsStub: IDbListAnimals;
	}

	const makeSut = (): ISutTypes => {
		const listAnimalsStub = new DbListAnimalsStub();
		const sut = new ListAnimalsController(listAnimalsStub);
		return { sut, listAnimalsStub };
	};

	it("should return 204 if there is an empty response", async () => {
		const { sut, listAnimalsStub } = makeSut();
		jest.spyOn(listAnimalsStub, "list").mockReturnValue(
			Promise.resolve([])
		);

		const response = await sut.handle({ body: null });
		expect(response).toEqual(noContent());
	});

	it("should call the DbListAnimals", async () => {
		const { sut, listAnimalsStub } = makeSut();
		const listAnimalsSpy = jest.spyOn(listAnimalsStub, "list");

		await sut.handle({ body: null });

		expect(listAnimalsSpy).toHaveBeenCalledTimes(1);
	});

	it("should return 500 if listAnimals method throws", async () => {
		const { sut, listAnimalsStub } = makeSut();
		jest.spyOn(listAnimalsStub, "list").mockImplementationOnce(() => {
			throw new Error();
		});
		const result = await sut.handle({ body: null });

		expect(result.statusCode).toBe(500);
	});

	it("should return 200 with a list of animals in the body on success", async () => {
		const { sut } = makeSut();

		const response = await sut.handle({ body: null });

		expect(response.body).toEqual(
			expect.arrayContaining([
				{
					id: "1",
					name: "any_name",
					gender: "F",
					ownerId: "any_owner_id",
					age: mockDate,
				},
				{
					id: "2",
					name: "any_name",
					gender: "F",
					ownerId: "any_owner_id",
					age: mockDate,
				},
				{
					id: "3",
					name: "any_name",
					gender: "F",
					ownerId: "any_owner_id",
					age: mockDate,
				},
			])
		);
		expect(response.statusCode).toBe(200);
	});
});
