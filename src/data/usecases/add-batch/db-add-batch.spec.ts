import { ICheckBatchByNameRepository } from "@/data/protocols/db/batch/check-batch-by-name-repository";
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
	class CheckBatchByNameRepositoryStub
		implements ICheckBatchByNameRepository
	{
		async checkByName(name: string): Promise<boolean> {
			return false;
		}
	}

	type ISutTypes = {
		sut: DbAddBatch;
		checkAccountByIdRepositoryStub: CheckAccountByIdRepositoryStub;
		checkBatchByNameRepositoryStub: CheckBatchByNameRepositoryStub;
		addBatchRepositoryStub: AddBatchRepositoryStub;
	};

	const makeSut = (): ISutTypes => {
		const checkAccountByIdRepositoryStub =
			new CheckAccountByIdRepositoryStub();
		const addBatchRepositoryStub = new AddBatchRepositoryStub();
		const checkBatchByNameRepositoryStub =
			new CheckBatchByNameRepositoryStub();

		return {
			sut: new DbAddBatch(
				checkAccountByIdRepositoryStub,
				addBatchRepositoryStub,
				checkBatchByNameRepositoryStub
			),
			addBatchRepositoryStub,
			checkAccountByIdRepositoryStub,
			checkBatchByNameRepositoryStub,
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

		it("should call checkBatchByNameRepository with the correct name", async () => {
			const { sut, checkBatchByNameRepositoryStub } = makeSut();
			const checkByNameSpy = jest.spyOn(
				checkBatchByNameRepositoryStub,
				"checkByName"
			);
			const fakeBatch = makeFakeBatch();
			await sut.add(fakeBatch);
			expect(checkByNameSpy).toHaveBeenCalledWith(
				fakeBatch.name,
				fakeBatch.ownerId
			);
		});
		it("should return false if the name is already in use", async () => {
			const { sut, checkBatchByNameRepositoryStub } = makeSut();
			jest.spyOn(
				checkBatchByNameRepositoryStub,
				"checkByName"
			).mockResolvedValueOnce(true);

			const fakeBatch = makeFakeBatch();
			const response = await sut.add(fakeBatch);

			expect(response).toBeFalsy();
		});
	});
});
