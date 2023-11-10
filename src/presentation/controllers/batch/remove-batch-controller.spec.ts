import { RemoveBatchController } from "./remove-batch-controller";
import { IDbRemoveBatch } from "@/domain/usecases/batch/remove-batch";
import { notFound, ok, serverError } from "../../helpers/http-helpers";

describe("Remove Batch Controller", () => {
	class DbRemoveBatchStub implements IDbRemoveBatch {
		async remove(batchId: string): Promise<boolean> {
			return true;
		}
	}

	interface ISutTypes {
		sut: RemoveBatchController;
		dbRemoveBatchStub: DbRemoveBatchStub;
	}

	const makeSut = (): ISutTypes => {
		const dbRemoveBatchStub = new DbRemoveBatchStub();
		const sut = new RemoveBatchController(dbRemoveBatchStub);
		return { sut, dbRemoveBatchStub };
	};

	const makeFakeRequest = () => ({
		batchId: "valid_batch_id",
		body: null,
	});

	describe("handle", () => {
		it("should call DbRemoveBatch with correct data", async () => {
			const { sut, dbRemoveBatchStub } = makeSut();
			const dbRemoveSpy = jest.spyOn(dbRemoveBatchStub, "remove");

			await sut.handle(makeFakeRequest());

			expect(dbRemoveSpy).toHaveBeenCalledWith("valid_batch_id");
		});

		it("should return 404 if DbRemoveBatch returns false", async () => {
			const { sut, dbRemoveBatchStub } = makeSut();
			jest.spyOn(dbRemoveBatchStub, "remove").mockResolvedValueOnce(
				false
			);

			const response = await sut.handle(makeFakeRequest());

			expect(response).toEqual(notFound());
		});

		it("should return 200 if DbRemoveBatch returns true", async () => {
			const { sut } = makeSut();

			const response = await sut.handle(makeFakeRequest());

			expect(response).toEqual(ok());
		});

		it("should return 500 if DbRemoveBatch throws", async () => {
			const { sut, dbRemoveBatchStub } = makeSut();
			jest.spyOn(dbRemoveBatchStub, "remove").mockRejectedValueOnce(
				new Error()
			);

			const result = await sut.handle(makeFakeRequest());

			expect(result).toEqual(serverError(new Error()));
		});
	});
});
