import { LoadBatchAnimalsController } from "./load-batch-animals-controller";
import { IDbListAnimalsByBatch } from "@/domain/usecases/list-animals-by-batch";
import { noContent, notFound, ok } from "../../helpers/http-helpers";
import { IAnimalModel } from "@/domain/models/animals";

describe("Load Batch Controller", () => {
	class DbListAnimalsByBatchStub implements IDbListAnimalsByBatch {
		async list(batchId: string): Promise<IAnimalModel[] | null> {
			return [
				{
					id: "any",
					gender: "F",
					batchId,
					age: new Date("01/01/2000").toISOString(),
					ownerId: "any_ownerId",
				},
				{
					id: "any",
					gender: "F",
					batchId,
					age: new Date("01/01/2000").toISOString(),
					ownerId: "any_ownerId",
				},
				{
					id: "any",
					gender: "F",
					batchId,
					age: new Date("01/01/2000").toISOString(),
					ownerId: "any_ownerId",
				},
			];
		}
	}

	interface ISutTypes {
		sut: LoadBatchAnimalsController;
		dbListAnimalsByBatchStub: DbListAnimalsByBatchStub;
	}

	const makeSut = (): ISutTypes => {
		const dbListAnimalsByBatchStub = new DbListAnimalsByBatchStub();
		const sut = new LoadBatchAnimalsController(dbListAnimalsByBatchStub);
		return { sut, dbListAnimalsByBatchStub };
	};

	const makeFakeRequest = () => ({
		batchId: "valid_batch_id", // request param
		body: null,
	});

	it("should call DbListAnimalsByBatch with correct data", async () => {
		const { sut, dbListAnimalsByBatchStub } = makeSut();
		const dbListSpy = jest.spyOn(dbListAnimalsByBatchStub, "list");

		await sut.handle(makeFakeRequest());

		expect(dbListSpy).toHaveBeenCalledWith("valid_batch_id");
	});

	it("should return 204 if DbListAnimalsByBatch returns an empty array", async () => {
		const { sut, dbListAnimalsByBatchStub } = makeSut();
		jest.spyOn(dbListAnimalsByBatchStub, "list").mockResolvedValueOnce([]);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(noContent());
	});

	it("should return 404 if DbListAnimalsByBatch returns null", async () => {
		const { sut, dbListAnimalsByBatchStub } = makeSut();
		jest.spyOn(dbListAnimalsByBatchStub, "list").mockResolvedValueOnce(
			null
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(notFound());
	});

	it("should return 200 with the animals data if DbListAnimalsByBatch returns data", async () => {
		const { sut } = makeSut();

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(200);
		expect(response).toEqual(
			ok([
				{
					id: "any",
					batchId: "valid_batch_id",
					gender: "F",
					age: new Date("01/01/2000").toISOString(),
					ownerId: "any_ownerId",
				},
				{
					id: "any",
					batchId: "valid_batch_id",
					gender: "F",
					age: new Date("01/01/2000").toISOString(),
					ownerId: "any_ownerId",
				},
				{
					id: "any",
					batchId: "valid_batch_id",
					gender: "F",
					age: new Date("01/01/2000").toISOString(),
					ownerId: "any_ownerId",
				},
			])
		);
	});

	it("should return 500 if DbListAnimalsByBatch throws", async () => {
		const { sut, dbListAnimalsByBatchStub } = makeSut();
		jest.spyOn(dbListAnimalsByBatchStub, "list").mockRejectedValueOnce(
			new Error()
		);

		const result = await sut.handle(makeFakeRequest());

		expect(result.statusCode).toBe(500);
	});
});
