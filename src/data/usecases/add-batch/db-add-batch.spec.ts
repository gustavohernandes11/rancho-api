import { DbAddBatch } from "./db-add-batch";
import {
	IAddBatchModel,
	ICheckAccountByIdRepository,
	IAddBatchRepository,
} from "./db-add-batch-protocols";

describe("DbAddBatch", () => {
	const makeFakeBatch = (): IAddBatchModel => ({
		name: "any_batch_name",
		ownerId: "any_id",
	});

	class CheckAccountByIdRepositoryStub
		implements ICheckAccountByIdRepository
	{
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}

	class AddBatchRepositoryStub implements IAddBatchRepository {
		async addBatch(batch: IAddBatchModel): Promise<boolean> {
			return true;
		}
	}

	type ISutTypes = {
		sut: DbAddBatch;
		checkAccountByIdRepositoryStub: CheckAccountByIdRepositoryStub;
		addBatchRepositoryStub: AddBatchRepositoryStub;
	};

	const makeSut = (): ISutTypes => {
		const checkAccountByIdRepositoryStub =
			new CheckAccountByIdRepositoryStub();
		const addBatchRepositoryStub = new AddBatchRepositoryStub();
		return {
			sut: new DbAddBatch(
				checkAccountByIdRepositoryStub,
				addBatchRepositoryStub
			),
			addBatchRepositoryStub,
			checkAccountByIdRepositoryStub,
		};
	};

	describe("add()", () => {
		it("should call the checkAccountByIdRepository with the correct ownerId", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			const checkByIdSpy = jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			);
			const fakeBatch = makeFakeBatch();
			await sut.add(fakeBatch);
			expect(checkByIdSpy).toHaveBeenCalledWith(fakeBatch.ownerId);
		});

		it("should return false if the owner does not exist", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			).mockResolvedValue(false);
			const fakeBatch = makeFakeBatch();
			const result = await sut.add(fakeBatch);
			expect(result).toBe(false);
		});

		it("should call the addBatchRepository with the correct batch data", async () => {
			const { sut, addBatchRepositoryStub } = makeSut();
			const addBatchSpy = jest.spyOn(addBatchRepositoryStub, "addBatch");
			const fakeBatch = makeFakeBatch();
			await sut.add(fakeBatch);
			expect(addBatchSpy).toHaveBeenCalledWith(fakeBatch);
		});

		it("should return true if the batch was added", async () => {
			const { sut } = makeSut();
			const fakeBatch = makeFakeBatch();
			const result = await sut.add(fakeBatch);
			expect(result).toBe(true);
		});
	});
});
