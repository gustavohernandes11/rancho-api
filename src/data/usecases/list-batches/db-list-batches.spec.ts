import { DbListBatches } from "./db-list-batches";
import {
	IBatchModel,
	ICheckAccountByIdRepository,
	IDbListBatches,
	IListBatchesByOwnerIdRepository,
} from "./db-list-batches-protocols";

describe("DbListBatches", () => {
	class ListBatchesByOwnerIdRepositoryStub
		implements IListBatchesByOwnerIdRepository
	{
		async listBatches(ownerId: string): Promise<IBatchModel[]> {
			return [
				{
					id: "valid_account_id",
					name: "any_name",
					ownerId: "any_ownerId",
				},
				{
					id: "valid_account_id",
					name: "any_name",
					ownerId: "any_ownerId",
				},
				{
					id: "valid_account_id",
					name: "any_name",
					ownerId: "any_ownerId",
				},
			];
		}
	}

	class CheckAccountByIdRepositoryStub
		implements ICheckAccountByIdRepository
	{
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}

	type SutTypes = {
		sut: IDbListBatches;
		listBatchesByOwnerIdRepositoryStub: IListBatchesByOwnerIdRepository;
		checkAccountByIdRepositoryStub: ICheckAccountByIdRepository;
	};

	const makeSut = (): SutTypes => {
		const listBatchesByOwnerIdRepositoryStub =
			new ListBatchesByOwnerIdRepositoryStub();
		const checkAccountByIdRepositoryStub =
			new CheckAccountByIdRepositoryStub();
		const sut = new DbListBatches(
			checkAccountByIdRepositoryStub,
			listBatchesByOwnerIdRepositoryStub
		);
		return {
			sut,
			listBatchesByOwnerIdRepositoryStub,
			checkAccountByIdRepositoryStub,
		};
	};

	describe("listBatches", () => {
		it("should call checkAccountByIdRepository with the correct account ID", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			const checkSpy = jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			);

			const fakeAccountId = "valid_account_id";
			await sut.listBatches(fakeAccountId);

			expect(checkSpy).toHaveBeenCalledWith(fakeAccountId);
		});

		it("should return null if the account is not valid", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			).mockResolvedValue(false);

			const result = await sut.listBatches("invalid_account_id");

			expect(result).toBeNull();
		});

		it("should call listBatchesByOwnerIdRepositoryStub with the correct owner ID if the account is valid", async () => {
			const { sut, listBatchesByOwnerIdRepositoryStub } = makeSut();
			const listSpy = jest.spyOn(
				listBatchesByOwnerIdRepositoryStub,
				"listBatches"
			);

			const fakeAccountId = "valid_account_id";
			await sut.listBatches(fakeAccountId);

			expect(listSpy).toHaveBeenCalledWith(fakeAccountId);
		});

		it("should return an array of animals if the account is valid", async () => {
			const { sut } = makeSut();
			const fakeAccountId = "valid_account_id";
			const result = await sut.listBatches(fakeAccountId);

			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(3);
		});
	});
});
