import { DbRemoveAnimal } from "./db-remove-animal";
import {
	IDbRemoveAnimal,
	IRemoveAnimalByIdRepository,
} from "./db-remove-animal-protocols";

describe("DbRemoveAnimal", () => {
	class RemoveAnimalByIdRepositoryStub
		implements IRemoveAnimalByIdRepository
	{
		async removeAnimal(id: string): Promise<boolean> {
			return true;
		}
	}

	type SutTypes = {
		sut: IDbRemoveAnimal;
		removeAnimalByIdRepositoryStub: RemoveAnimalByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const removeAnimalByIdRepositoryStub =
			new RemoveAnimalByIdRepositoryStub();
		const sut = new DbRemoveAnimal(removeAnimalByIdRepositoryStub);
		return {
			sut,
			removeAnimalByIdRepositoryStub,
		};
	};

	describe("remove", () => {
		it("should call removeAnimalByIdRepository with the correct ID", async () => {
			const { sut, removeAnimalByIdRepositoryStub } = makeSut();
			const removeSpy = jest.spyOn(
				removeAnimalByIdRepositoryStub,
				"removeAnimal"
			);

			const fakeAnimalId = "existing_id";
			await sut.remove(fakeAnimalId);

			expect(removeSpy).toHaveBeenCalledWith(fakeAnimalId);
		});

		it("should return true if the animal is successfully removed", async () => {
			const { sut } = makeSut();
			const result = await sut.remove("existing_id");

			expect(result).toBe(true);
		});

		it("should return false if the animal removal fails", async () => {
			const { sut, removeAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				removeAnimalByIdRepositoryStub,
				"removeAnimal"
			).mockReturnValueOnce(Promise.resolve(false));
			const result = await sut.remove("non_existing_id");

			expect(result).toBe(false);
		});
		it("should throw an error if removeAnimalByIdRepository throws", async () => {
			const { sut, removeAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				removeAnimalByIdRepositoryStub,
				"removeAnimal"
			).mockRejectedValue(new Error());

			const fakeAnimalId = "existing_id";
			const removePromise = sut.remove(fakeAnimalId);

			await expect(removePromise).rejects.toThrow();
		});
	});
});
