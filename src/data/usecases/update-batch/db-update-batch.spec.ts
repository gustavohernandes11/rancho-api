import { IUpdateBatchByIdRepository } from "@data/protocols/db/batch/update-batch-by-id-repository";
import { IBatchModel } from "@domain/models/batch";
import {
	IDbUpdateBatch,
	IUpdateBatchModel,
} from "@domain/usecases/batch/update-batch";
import { DbUpdateBatch } from "./db-update-batch";

describe("DbUpdateBatch", () => {
	const makeFakeUpdateBatchModel = (): IUpdateBatchModel => ({
		name: "updated_batch_name",
		ownerId: "updated_ownerId",
	});

	class UpdateBatchByIdRepositoryStub implements IUpdateBatchByIdRepository {
		async updateBatch(
			id: string,
			props: IUpdateBatchModel
		): Promise<IBatchModel | null> {
			return {
				id: id || "any_id",
				name: props.name || "original_name",
				ownerId: "any_ownerId",
			};
		}
	}

	type SutTypes = {
		sut: IDbUpdateBatch;
		updateBatchRepositoryStub: UpdateBatchByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const updateBatchRepositoryStub = new UpdateBatchByIdRepositoryStub();
		const sut = new DbUpdateBatch(updateBatchRepositoryStub);
		return {
			sut,
			updateBatchRepositoryStub,
		};
	};

	describe("update()", () => {
		it("should call updateAnimalRepository with the correct values", async () => {
			const { sut, updateBatchRepositoryStub } = makeSut();
			const updateSpy = jest.spyOn(
				updateBatchRepositoryStub,
				"updateBatch"
			);

			const fakeBatchId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateBatchModel();
			await sut.update(fakeBatchId, fakeUpdateModel);

			expect(updateSpy).toHaveBeenCalledWith(
				fakeBatchId,
				fakeUpdateModel
			);
		});

		it("should return true if the update is successful", async () => {
			const { sut } = makeSut();
			const fakeBatchId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateBatchModel();
			const result = await sut.update(fakeBatchId, fakeUpdateModel);

			expect(result).toBeTruthy();
		});

		it("should return false if the update fails", async () => {
			const { sut, updateBatchRepositoryStub } = makeSut();
			jest.spyOn(
				updateBatchRepositoryStub,
				"updateBatch"
			).mockResolvedValue(null);

			const fakeBatchId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateBatchModel();
			const result = await sut.update(fakeBatchId, fakeUpdateModel);

			expect(result).toBeFalsy();
		});
		it("should throws if updateBatchRepositoryStub thows", async () => {
			const { sut, updateBatchRepositoryStub } = makeSut();
			jest.spyOn(
				updateBatchRepositoryStub,
				"updateBatch"
			).mockRejectedValue(new Error());

			const fakeBatchId = "fake_id";
			const fakeUpdateModel = makeFakeUpdateBatchModel();
			const promise = sut.update(fakeBatchId, fakeUpdateModel);

			expect(promise).rejects.toThrow();
		});
	});
});
