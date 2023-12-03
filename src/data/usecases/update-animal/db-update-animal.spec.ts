import { DbUpdateAnimal } from "./db-update-animal";
import {
	IAnimalModel,
	IDbUpdateAnimal,
	IUpdateAnimalByIdRepository,
	IUpdateAnimalModel,
} from "./db-update-animal-protocols";

describe("DbUpdateAnimal", () => {
	const makeFakeUpdateAnimalModel = (): IUpdateAnimalModel => ({
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
		sut: IDbUpdateAnimal;
		updateAnimalRepositoryStub: UpdateAnimalByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const updateAnimalRepositoryStub = new UpdateAnimalByIdRepositoryStub();
		const sut = new DbUpdateAnimal(updateAnimalRepositoryStub);
		return {
			sut,
			updateAnimalRepositoryStub,
		};
	};

	describe("update()", () => {
		it("should call updateAnimalRepository with the correct values", async () => {
			const { sut, updateAnimalRepositoryStub } = makeSut();
			const updateSpy = jest.spyOn(
				updateAnimalRepositoryStub,
				"updateAnimal"
			);

			const fakeAnimalId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateAnimalModel();
			await sut.update(fakeAnimalId, fakeUpdateModel);

			expect(updateSpy).toHaveBeenCalledWith(
				fakeAnimalId,
				fakeUpdateModel
			);
		});

		it("should return the updated animal if the update is successful", async () => {
			const { sut } = makeSut();
			const fakeAnimalId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateAnimalModel();
			const result = await sut.update(fakeAnimalId, fakeUpdateModel);

			expect(result).toEqual(expect.objectContaining(fakeUpdateModel));
		});

		it("should return null if the update fails", async () => {
			const { sut, updateAnimalRepositoryStub } = makeSut();
			jest.spyOn(
				updateAnimalRepositoryStub,
				"updateAnimal"
			).mockResolvedValue(null);

			const fakeAnimalId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateAnimalModel();
			const result = await sut.update(fakeAnimalId, fakeUpdateModel);

			expect(result).toBeNull();
		});
	});
});
