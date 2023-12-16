import { IListAnimalsByBatchRepository } from "../list-animals-by-batch/db-list-animals-by-batch-protocols";
import {
	IAnimalModel,
	IUpdateAnimalByIdRepository,
	IUpdateAnimalModel,
} from "../update-animal/db-update-animal-protocols";
import { DbRemoveBatch } from "./db-remove-batch";
import {
	ICheckBatchByIdRepository,
	IDbRemoveBatch,
	IRemoveBatchByIdRepository,
} from "./db-remove-batch-protocols";

describe("DbRemoveBatch", () => {
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

	class ListAnimalsByBatchRepositoryStub
		implements IListAnimalsByBatchRepository
	{
		async listByBatch(batchId: string): Promise<IAnimalModel[] | null> {
			return [
				{
					age: new Date().toISOString(),
					id: "any_id_1",
					gender: "F",
					name: "any-name",
					ownerId: "any-ownerId",
				},
				{
					age: new Date().toISOString(),
					id: "any_id_2",
					gender: "F",
					name: "any-name",
					ownerId: "any-ownerId",
				},
			];
		}
	}

	class RemoveBatchByIdRepositoryStub implements IRemoveBatchByIdRepository {
		async removeBatch(id: string): Promise<boolean> {
			return true;
		}
	}

	class CheckBatchByIdRepositoryStub implements ICheckBatchByIdRepository {
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}

	type SutTypes = {
		sut: IDbRemoveBatch;
		removeBatchByIdRepositoryStub: RemoveBatchByIdRepositoryStub;
		checkBatchByIdRepositoryStub: CheckBatchByIdRepositoryStub;
		listAnimalsByBatchRepositoryStub: ListAnimalsByBatchRepositoryStub;
		updateAnimalByIdRepositoryStub: UpdateAnimalByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const removeBatchByIdRepositoryStub =
			new RemoveBatchByIdRepositoryStub();
		const checkBatchByIdRepositoryStub = new CheckBatchByIdRepositoryStub();
		const updateAnimalByIdRepositoryStub =
			new UpdateAnimalByIdRepositoryStub();
		const listAnimalsByBatchRepositoryStub =
			new ListAnimalsByBatchRepositoryStub();

		const sut = new DbRemoveBatch(
			removeBatchByIdRepositoryStub,
			checkBatchByIdRepositoryStub,
			updateAnimalByIdRepositoryStub,
			listAnimalsByBatchRepositoryStub
		);
		return {
			sut,
			removeBatchByIdRepositoryStub,
			checkBatchByIdRepositoryStub,
			updateAnimalByIdRepositoryStub,
			listAnimalsByBatchRepositoryStub,
		};
	};

	describe("remove", () => {
		it("should call checkBatchByIdRepository with the correct ID", async () => {
			const { sut, checkBatchByIdRepositoryStub } = makeSut();
			const checkSpy = jest.spyOn(
				checkBatchByIdRepositoryStub,
				"checkById"
			);

			const fakeBatchId = "existing_batch_id";
			await sut.remove(fakeBatchId);

			expect(checkSpy).toHaveBeenCalledWith(fakeBatchId);
		});

		it("should return true if the batch is successfully removed", async () => {
			const { sut } = makeSut();
			const result = await sut.remove("existing_batch_id");

			expect(result).toBe(true);
		});

		it("should return false if the batch removal fails", async () => {
			const { sut, removeBatchByIdRepositoryStub } = makeSut();
			jest.spyOn(
				removeBatchByIdRepositoryStub,
				"removeBatch"
			).mockReturnValueOnce(Promise.resolve(false));
			const result = await sut.remove("NONEXISTENT_batch_id");

			expect(result).toBe(false);
		});

		it("should return false if the batch is not valid (checkBatchByIdRepository returns false)", async () => {
			const { sut, checkBatchByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkBatchByIdRepositoryStub,
				"checkById"
			).mockReturnValueOnce(Promise.resolve(false));
			const result = await sut.remove("invalid_batch_id");

			expect(result).toBe(false);
		});

		it("should throw an error if removeBatchByIdRepository throws", async () => {
			const { sut, removeBatchByIdRepositoryStub } = makeSut();
			jest.spyOn(
				removeBatchByIdRepositoryStub,
				"removeBatch"
			).mockRejectedValue(new Error());

			const fakeBatchId = "existing_batch_id";
			const removePromise = sut.remove(fakeBatchId);

			await expect(removePromise).rejects.toThrow();
		});
		it("should call updateAnimalByIdRepository for each animal from the deleted batch", async () => {
			const { sut, updateAnimalByIdRepositoryStub } = makeSut();
			const updateAnimalSpy = jest.spyOn(
				updateAnimalByIdRepositoryStub,
				"updateAnimal"
			);

			const fakeBatchId = "existing_batch_id";
			await sut.remove(fakeBatchId);

			expect(updateAnimalSpy).toHaveBeenCalledTimes(2);
		});
		it("should call listAnimalsByBatchRepository on success", async () => {
			const { sut, listAnimalsByBatchRepositoryStub } = makeSut();
			const listAnimalsSpy = jest.spyOn(
				listAnimalsByBatchRepositoryStub,
				"listByBatch"
			);

			const fakeBatchId = "existing_batch_id";
			await sut.remove(fakeBatchId);

			expect(listAnimalsSpy).toHaveBeenCalledTimes(1);
		});
	});
});
