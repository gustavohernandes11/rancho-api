import { IDbAddBatch, IAddBatchModel } from "@domain/usecases/batch/add-batch";
import { makeAddBatchValidations } from "@main/factories/validation/make-add-batch-validations";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok } from "../../helpers/http-helpers";
import { AddBatchController } from "./add-batch-controller";

describe("Add Batch Controller", () => {
	class DbAddBatchStub implements IDbAddBatch {
		async add(batch: IAddBatchModel): Promise<boolean> {
			return true;
		}
	}

	interface ISutTypes {
		sut: AddBatchController;
		dbAddBatchStub: DbAddBatchStub;
	}
	const makeSut = (): ISutTypes => {
		const validations = makeAddBatchValidations();
		const dbAddBatchStub = new DbAddBatchStub();
		const sut = new AddBatchController(validations, dbAddBatchStub);
		return { sut, dbAddBatchStub };
	};

	const makeFakeRequest = () => ({
		body: {
			name: "any_batch_name",
			ownerId: "any_id",
		},
	});

	describe("DbAddBatch", () => {
		it("should call DbAddBatch with correct data", async () => {
			const { sut, dbAddBatchStub } = makeSut();
			const dbAddSpy = jest.spyOn(dbAddBatchStub, "add");

			await sut.handle(makeFakeRequest());

			expect(dbAddSpy).toHaveBeenCalledWith({
				name: "any_batch_name",
				ownerId: "any_id",
			});
		});

		it("should return 400 if DbAddBatch returns false", async () => {
			const { sut, dbAddBatchStub } = makeSut();
			jest.spyOn(dbAddBatchStub, "add").mockImplementationOnce(() =>
				Promise.resolve(false)
			);

			const response = await sut.handle(makeFakeRequest());

			expect(response).toEqual(
				badRequest(new InvalidParamError("ownerId"))
			);
		});

		it("should return 500 if DbAddBatch throws", async () => {
			const { sut, dbAddBatchStub } = makeSut();
			jest.spyOn(dbAddBatchStub, "add").mockImplementationOnce(() => {
				throw new Error();
			});

			const result = await sut.handle(makeFakeRequest());

			expect(result.statusCode).toBe(500);
		});
	});

	describe("Validations", () => {
		it("should return 400 when no batch name is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle({
				body: { ownerId: "any_id" },
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("name"));
		});

		it("should return 400 when no ownerId is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle({
				body: { name: "any_batch_name" },
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("ownerId"));
		});
	});

	it("should return 200 when the data is correctly added", async () => {
		const { sut } = makeSut();
		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(200);
		expect(response).toEqual(ok());
	});
});
