import { ListBatchesController } from "./list-batches-controller";
import { IDbListBatches } from "@/domain/usecases/batch/list-batches";
import { noContent, ok, serverError } from "../../helpers/http-helpers";
import { IBatchModel } from "@/domain/models/batch";

describe("List Batches Controller", () => {
	class DbListBatchesStub implements IDbListBatches {
		async listBatches(accountId: string): Promise<IBatchModel[] | null> {
			return [];
		}
	}

	interface ISutTypes {
		sut: ListBatchesController;
		dbListBatchesStub: DbListBatchesStub;
	}

	const makeSut = (): ISutTypes => {
		const dbListBatchesStub = new DbListBatchesStub();
		const sut = new ListBatchesController(dbListBatchesStub);
		return { sut, dbListBatchesStub };
	};

	const makeFakeRequest = () => ({
		accountId: "valid_account_id",
		body: null,
	});

	it("should call DbListBatches with correct data", async () => {
		const { sut, dbListBatchesStub } = makeSut();
		const dbListSpy = jest.spyOn(dbListBatchesStub, "listBatches");

		await sut.handle(makeFakeRequest());

		expect(dbListSpy).toHaveBeenCalledWith("valid_account_id");
	});

	it("should return 204 if DbListBatches returns an empty array", async () => {
		const { sut, dbListBatchesStub } = makeSut();
		jest.spyOn(dbListBatchesStub, "listBatches").mockResolvedValueOnce([]);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(noContent());
	});

	it("should return 200 with the batches data if DbListBatches returns data", async () => {
		const { sut, dbListBatchesStub } = makeSut();
		const batchesData = [
			{ id: "1", name: "Batch 1", ownerId: "any_ownerId" },
			{ id: "2", name: "Batch 2", ownerId: "any_ownerId" },
		];
		jest.spyOn(dbListBatchesStub, "listBatches").mockResolvedValueOnce(
			batchesData
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(200);
		expect(response).toEqual(ok(batchesData));
	});

	it("should return 500 if DbListBatches throws", async () => {
		const { sut, dbListBatchesStub } = makeSut();
		jest.spyOn(dbListBatchesStub, "listBatches").mockRejectedValueOnce(
			new Error()
		);

		const result = await sut.handle(makeFakeRequest());

		expect(result.statusCode).toBe(500);
		expect(result).toEqual(serverError(new Error()));
	});
});
