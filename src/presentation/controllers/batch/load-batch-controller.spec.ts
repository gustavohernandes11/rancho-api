import { LoadBatchController } from "./load-batch-controller";
import { notFound } from "@/presentation/helpers/http-helpers";
import { IBatchInfo } from "@/domain/models/batch-info";
import { IDbLoadBatch } from "@/domain/usecases/load-batch";

describe("LoadBatchController", () => {
	class DbLoadBatchStub implements IDbLoadBatch {
		load(id: string): Promise<IBatchInfo | null> {
			return Promise.resolve({
				id: "1",
				name: "any_name",
				ownerId: "any_ownerId",
				count: 0,
			});
		}
	}

	interface ISutTypes {
		sut: LoadBatchController;
		dbLoadBatchStub: DbLoadBatchStub;
	}

	const makeSut = (): ISutTypes => {
		const dbLoadBatchStub = new DbLoadBatchStub();
		const sut = new LoadBatchController(dbLoadBatchStub);
		return { sut, dbLoadBatchStub };
	};

	it("should return 404 if the IDbLoadBatch return null", async () => {
		const { sut, dbLoadBatchStub } = makeSut();
		jest.spyOn(dbLoadBatchStub, "load").mockReturnValue(
			Promise.resolve(null)
		);

		const response = await sut.handle({ body: null });
		expect(response).toEqual(notFound());
	});

	it("should call the IDbLoadBatch", async () => {
		const { sut, dbLoadBatchStub } = makeSut();
		const loadBatchSpy = jest.spyOn(dbLoadBatchStub, "load");

		await sut.handle({ body: null });

		expect(loadBatchSpy).toHaveBeenCalledTimes(1);
	});

	it("should return 500 if listBatchs method throws", async () => {
		const { sut, dbLoadBatchStub } = makeSut();
		jest.spyOn(dbLoadBatchStub, "load").mockImplementationOnce(() => {
			throw new Error();
		});

		const result = await sut.handle({ body: null });

		expect(result.statusCode).toBe(500);
	});

	it("should return 200 with the batch data", async () => {
		const { sut } = makeSut();

		const response = await sut.handle({ body: null });

		expect(response.body).toEqual(
			expect.objectContaining({
				id: "1",
				name: "any_name",
				ownerId: "any_ownerId",
				count: 0,
			})
		);
		expect(response.statusCode).toBe(200);
	});
});
