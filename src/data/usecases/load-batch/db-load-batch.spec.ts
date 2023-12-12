import { DbLoadBatch } from "./db-load-batch";
import { ILoadBatchByIdRepository } from "@/data/protocols/db/batch/load-batch-by-id-repository";
import { IDbLoadBatch } from "@/domain/usecases/load-batch";
import { IBatchInfo } from "@/domain/models/batch-info";

describe("DbLoadBatch", () => {
	class LoadBatchByIdRepository implements ILoadBatchByIdRepository {
		async loadBatch(id: string): Promise<IBatchInfo | null> {
			return {
				id: id,
				ownerId: "owner_id",
				name: "batch_name",
				count: 1,
			};
		}
	}

	type SutTypes = {
		sut: IDbLoadBatch;
		loadBatchByIdRepositoryStub: LoadBatchByIdRepository;
	};

	const makeSut = (): SutTypes => {
		const loadBatchByIdRepositoryStub = new LoadBatchByIdRepository();
		const sut = new DbLoadBatch(loadBatchByIdRepositoryStub);
		return {
			sut,
			loadBatchByIdRepositoryStub,
		};
	};

	describe("load", () => {
		it("should call loadBatchByIdRepository with the correct ID", async () => {
			const { sut, loadBatchByIdRepositoryStub } = makeSut();
			const loadSpy = jest.spyOn(
				loadBatchByIdRepositoryStub,
				"loadBatch"
			);

			const fakeBatchId = "existing_id";
			await sut.load(fakeBatchId);

			expect(loadSpy).toHaveBeenCalledWith(fakeBatchId);
		});

		it("should return the loaded batch if it exists", async () => {
			const { sut } = makeSut();
			const fakeBatchId = "existing_id";
			const result = await sut.load(fakeBatchId);

			expect(result).toEqual(
				expect.objectContaining({ id: fakeBatchId })
			);
		});

		it("should return null if the batch does not exist", async () => {
			const { sut, loadBatchByIdRepositoryStub } = makeSut();
			jest.spyOn(
				loadBatchByIdRepositoryStub,
				"loadBatch"
			).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

			const fakeBatchId = "non_existing_id";
			const result = await sut.load(fakeBatchId);

			expect(result).toBeNull();
		});
	});
});
