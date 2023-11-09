import { UpdateBatchController } from "./update-batch-controller";
import {
	IDbUpdateBatch,
	IUpdateBatchModel,
} from "@domain/usecases/batch/update-batch";
import { InvalidParamError } from "@presentation/errors";
import { badRequest, ok } from "@presentation/helpers/http-helpers";
import { IValidation } from "@presentation/protocols";

describe("Update Batch Controller", () => {
	class DbUpdateBatchStub implements IDbUpdateBatch {
		async update(
			batchId: string,
			data: IUpdateBatchModel
		): Promise<any | null> {
			return {
				id: batchId,
				name: data.name,
				ownerId: data.ownerId,
			};
		}
	}

	class ValidationStub implements IValidation {
		validate(input: any): Error | null {
			return null;
		}
	}

	interface ISutTypes {
		sut: UpdateBatchController;
		dbUpdateBatchStub: DbUpdateBatchStub;
		validationStub: ValidationStub;
	}

	const makeSut = (): ISutTypes => {
		const dbUpdateBatchStub = new DbUpdateBatchStub();
		const validationStub = new ValidationStub();
		const sut = new UpdateBatchController(
			validationStub,
			dbUpdateBatchStub
		);
		return { sut, dbUpdateBatchStub, validationStub };
	};

	const makeFakeRequest = () => ({
		body: {
			name: "updated_batch_name",
			ownerId: "updated_owner_id",
		},
		batchId: "valid_batch_id",
	});

	it("should call DbUpdateBatch with correct data", async () => {
		const { sut, dbUpdateBatchStub } = makeSut();
		const dbUpdateSpy = jest.spyOn(dbUpdateBatchStub, "update");

		await sut.handle(makeFakeRequest());

		expect(dbUpdateSpy).toHaveBeenCalledWith("valid_batch_id", {
			name: "updated_batch_name",
			ownerId: "updated_owner_id",
		});
	});

	it("should return 400 if validation fails", async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, "validate").mockReturnValueOnce(
			new InvalidParamError("name")
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(badRequest(new InvalidParamError("name")));
	});

	it("should return 400 if DbUpdateBatch returns null", async () => {
		const { sut, dbUpdateBatchStub } = makeSut();
		jest.spyOn(dbUpdateBatchStub, "update").mockResolvedValueOnce(null);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(badRequest(new InvalidParamError("batchId")));
	});

	it("should return 200 with the updated batch data if DbUpdateBatch returns data", async () => {
		const { sut } = makeSut();

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(200);
		expect(response).toEqual(
			ok({
				id: "valid_batch_id",
				name: "updated_batch_name",
				ownerId: "updated_owner_id",
			})
		);
	});

	it("should return 500 if DbUpdateBatch throws", async () => {
		const { sut, dbUpdateBatchStub } = makeSut();
		jest.spyOn(dbUpdateBatchStub, "update").mockRejectedValueOnce(
			new Error()
		);

		const result = await sut.handle(makeFakeRequest());

		expect(result.statusCode).toBe(500);
	});
});
