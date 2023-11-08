import { DbRemoveBatch } from "./db-remove-batch";
import {
	ICheckBatchByIdRepository,
	IDbRemoveBatch,
	IRemoveBatchByIdRepository,
} from "./db-remove-batch-protocols";

describe("DbRemoveBatch", () => {
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
	};

	const makeSut = (): SutTypes => {
		const removeBatchByIdRepositoryStub =
			new RemoveBatchByIdRepositoryStub();
		const checkBatchByIdRepositoryStub = new CheckBatchByIdRepositoryStub();
		const sut = new DbRemoveBatch(
			removeBatchByIdRepositoryStub,
			checkBatchByIdRepositoryStub
		);
		return {
			sut,
			removeBatchByIdRepositoryStub,
			checkBatchByIdRepositoryStub,
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
			const result = await sut.remove("non_existing_batch_id");

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
	});
});
