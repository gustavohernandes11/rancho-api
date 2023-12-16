import {
	IAnimalModel,
	ILoadAnimalByIdRepository,
} from "../load-animal/db-load-animal-protocols";
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
	class LoadAnimalByIdRepositoryStub implements ILoadAnimalByIdRepository {
		private readonly mockedAge = new Date().toISOString();
		async loadAnimal(id: string): Promise<IAnimalModel | null> {
			return {
				age: this.mockedAge,
				id: "any_id",
				gender: "M",
				ownerId: "any_owner_id",
			};
		}
	}

	type SutTypes = {
		sut: IDbRemoveAnimal;
		removeAnimalByIdRepositoryStub: RemoveAnimalByIdRepositoryStub;
		loadAnimalByIdRepositoryStub: LoadAnimalByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const removeAnimalByIdRepositoryStub =
			new RemoveAnimalByIdRepositoryStub();
		const loadAnimalByIdRepositoryStub = new LoadAnimalByIdRepositoryStub();
		const sut = new DbRemoveAnimal(
			removeAnimalByIdRepositoryStub,
			loadAnimalByIdRepositoryStub
		);
		return {
			sut,
			removeAnimalByIdRepositoryStub,
			loadAnimalByIdRepositoryStub,
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
			await sut.remove(fakeAnimalId, "any_owner_id");

			expect(removeSpy).toHaveBeenCalledWith(fakeAnimalId);
		});

		it("should return true if the animal is successfully removed", async () => {
			const { sut } = makeSut();
			const result = await sut.remove("existing_id", "any_owner_id");

			expect(result).toBe(true);
		});

		it("should return false if the animal removal fails", async () => {
			const { sut, removeAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				removeAnimalByIdRepositoryStub,
				"removeAnimal"
			).mockReturnValueOnce(Promise.resolve(false));
			const result = await sut.remove("NONEXISTENT_id", "any_owner_id");

			expect(result).toBe(false);
		});
		it("should return false if the ownerId is not the same as the props", async () => {
			const { sut, loadAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				loadAnimalByIdRepositoryStub,
				"loadAnimal"
			).mockReturnValueOnce(
				Promise.resolve({
					age: "any_age",
					id: "any_id",
					gender: "F",
					ownerId: "INVALID_OWNER_ID",
				})
			);
			const result = await sut.remove("any_id", "any_owner_id");

			expect(result).toBe(false);
		});

		it("should throw an error if removeAnimalByIdRepository throws", async () => {
			const { sut, removeAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				removeAnimalByIdRepositoryStub,
				"removeAnimal"
			).mockRejectedValue(new Error());

			const fakeAnimalId = "existing_id";
			const removePromise = sut.remove(fakeAnimalId, "any_owner_id");

			await expect(removePromise).rejects.toThrow();
		});
	});
});
