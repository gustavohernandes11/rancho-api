import { DbUpdateManyAnimals } from "./db-update-many-animals";
import {
	IAnimalModel,
	IDbUpdateManyAnimals,
	IUpdateAnimalByIdRepository,
	IUpdateAnimalModel,
	IUpdateAnimalWithId,
} from "./db-update-many-animals-protocols";

describe("DbUpdateAnimal", () => {
	const makeFakeUpdateAnimalModel = (id?: string): IUpdateAnimalWithId => ({
		id: id || "any_id",
		name: "updated_animal_name",
		age: new Date("2020-01-01").toISOString(),
	});

	class UpdateAnimalByIdRepositoryStub
		implements IUpdateAnimalByIdRepository
	{
		async updateAnimal(
			id: string,
			animal: IUpdateAnimalModel
		): Promise<IAnimalModel | null> {
			return {
				id: id || "any_id",
				name: animal.name || "original_animal_name",
				gender: animal.gender || "F",
				age: animal.age || new Date("2019-01-01").toISOString(),
				ownerId: "any_ownerId",
			};
		}
	}

	type SutTypes = {
		sut: IDbUpdateManyAnimals;
		updateAnimalRepositoryStub: UpdateAnimalByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const updateAnimalRepositoryStub = new UpdateAnimalByIdRepositoryStub();
		const sut = new DbUpdateManyAnimals(updateAnimalRepositoryStub);
		return {
			sut,
			updateAnimalRepositoryStub,
		};
	};

	describe("updateMany()", () => {
		it("should call updateAnimalRepository for each animal", async () => {
			const { sut, updateAnimalRepositoryStub } = makeSut();
			const updateSpy = jest.spyOn(
				updateAnimalRepositoryStub,
				"updateAnimal"
			);
			const animal1 = makeFakeUpdateAnimalModel("id_1");
			const animal2 = makeFakeUpdateAnimalModel("id_2");
			const animal3 = makeFakeUpdateAnimalModel("id_3");

			await sut.updateMany([animal1, animal2, animal3]);

			expect(updateSpy).toHaveBeenCalledTimes(3);

			expect(updateSpy).toHaveBeenCalledWith(animal1.id, animal1);
			expect(updateSpy).toHaveBeenCalledWith(animal2.id, animal2);
			expect(updateSpy).toHaveBeenCalledWith(animal3.id, animal3);
		});

		it("should return the updated animal if the update is successful", async () => {
			const { sut } = makeSut();

			const animal1 = makeFakeUpdateAnimalModel("id_1");
			const animal2 = makeFakeUpdateAnimalModel("id_2");
			const animal3 = makeFakeUpdateAnimalModel("id_3");

			const result = await sut.updateMany([animal1, animal2, animal3]);
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining(animal1),
					expect.objectContaining(animal2),
					expect.objectContaining(animal3),
				])
			);
		});

		it("should return null if the update fails for each call in array", async () => {
			const { sut, updateAnimalRepositoryStub } = makeSut();
			jest.spyOn(
				updateAnimalRepositoryStub,
				"updateAnimal"
			).mockResolvedValueOnce(null);

			const animal1 = makeFakeUpdateAnimalModel("id_1");
			const animal2 = makeFakeUpdateAnimalModel("id_2");
			const animal3 = makeFakeUpdateAnimalModel("id_3");

			const result = await sut.updateMany([animal1, animal2, animal3]);
			expect(result).toEqual(
				expect.arrayContaining([
					null,
					expect.objectContaining(animal2),
					expect.objectContaining(animal3),
				])
			);
		});
	});
});
