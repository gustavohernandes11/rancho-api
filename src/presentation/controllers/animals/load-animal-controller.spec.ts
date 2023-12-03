import { LoadAnimalController } from "./load-animal-controller";
import { IAnimalModel } from "@/domain/models/animals";
import { notFound } from "@/presentation/helpers/http-helpers";
import { IDbLoadAnimal } from "@/domain/usecases/load-animal";

describe("LoadAnimalController", () => {
	const mockDate = new Date().toISOString();

	class DbLoadAnimalStub implements IDbLoadAnimal {
		load(id: string): Promise<IAnimalModel | null> {
			return Promise.resolve({
				id: "1",
				name: "any_name",
				gender: "F",
				ownerId: "any_ownerId",
				age: mockDate,
			});
		}
	}

	interface ISutTypes {
		sut: LoadAnimalController;
		dbLoadAnimalStub: DbLoadAnimalStub;
	}

	const makeSut = (): ISutTypes => {
		const dbLoadAnimalStub = new DbLoadAnimalStub();
		const sut = new LoadAnimalController(dbLoadAnimalStub);
		return { sut, dbLoadAnimalStub };
	};

	it("should return 404 if the DbListAnimals return null", async () => {
		const { sut, dbLoadAnimalStub } = makeSut();
		jest.spyOn(dbLoadAnimalStub, "load").mockReturnValue(
			Promise.resolve(null)
		);

		const response = await sut.handle({ body: null });
		expect(response).toEqual(notFound());
	});

	it("should call the DbLoadAnimal", async () => {
		const { sut, dbLoadAnimalStub } = makeSut();
		const loadAnimalSpy = jest.spyOn(dbLoadAnimalStub, "load");

		await sut.handle({ body: null });

		expect(loadAnimalSpy).toHaveBeenCalledTimes(1);
	});

	it("should return 500 if listAnimals method throws", async () => {
		const { sut, dbLoadAnimalStub } = makeSut();
		jest.spyOn(dbLoadAnimalStub, "load").mockImplementationOnce(() => {
			throw new Error();
		});

		const result = await sut.handle({ body: null });

		expect(result.statusCode).toBe(500);
	});

	it("should return 200 with the animal data", async () => {
		const { sut } = makeSut();

		const response = await sut.handle({ body: null });

		expect(response.body).toEqual(
			expect.objectContaining({
				id: "1",
				name: "any_name",
				gender: "F",
				ownerId: "any_ownerId",
				age: mockDate,
			})
		);
		expect(response.statusCode).toBe(200);
	});
});
