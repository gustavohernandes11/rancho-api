import { IListAnimalsByOwnerIdRepository } from "@/data/protocols/db/animals/list-animals-by-owner-repository";
import { IDbListAnimals } from "@/domain/usecases/list-animals";
import { ICheckAccountByIdRepository } from "../add-animal/db-add-animal-protocols";
import { IAnimalModel } from "../update-animal/db-update-animal-protocols";
import { DbListAnimalsByBatch } from "./db-list-animals-by-batch";
import { ICheckBatchByIdRepository } from "../remove-batch/db-remove-batch-protocols";
import { IListAnimalsByBatchRepository } from "@/data/protocols/db/animals/list-animals-by-batch-repository";

describe("DbListAnimalsByBatch", () => {
	class CheckBatchByIdRepositoryStub implements ICheckBatchByIdRepository {
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}

	class ListAnimalsByBatchRepository
		implements IListAnimalsByBatchRepository
	{
		async listByBatch(id: string): Promise<IAnimalModel[]> {
			return [
				{
					id: "animal_id_1",
					ownerId: "any_ownerId",
					age: new Date("2020-01-01").toISOString(),
					name: "animal_1",
				},
				{
					id: "animal_id_2",
					ownerId: "any_ownerId",
					age: new Date("2019-01-01").toISOString(),
					name: "animal_2",
				},
			];
		}
	}

	type SutTypes = {
		sut: IDbListAnimals;
		checkBatchByIdRepositoryStub: CheckBatchByIdRepositoryStub;
		listAnimalsByBatchRepository: IListAnimalsByBatchRepository;
	};

	const makeSut = (): SutTypes => {
		const listAnimalsByBatchRepository = new ListAnimalsByBatchRepository();
		const checkBatchByIdRepositoryStub = new CheckBatchByIdRepositoryStub();
		const sut = new DbListAnimalsByBatch(
			checkBatchByIdRepositoryStub,
			listAnimalsByBatchRepository
		);
		return {
			sut,
			listAnimalsByBatchRepository,
			checkBatchByIdRepositoryStub,
		};
	};

	describe("list", () => {
		it("should call checkBatchByIdRepositoryStub with the correct account ID", async () => {
			const { sut, checkBatchByIdRepositoryStub } = makeSut();
			const checkSpy = jest.spyOn(
				checkBatchByIdRepositoryStub,
				"checkById"
			);

			const fakeAccountId = "valid_account_id";
			await sut.list(fakeAccountId);

			expect(checkSpy).toHaveBeenCalledWith(fakeAccountId);
		});

		it("should return null if the batch is not valid", async () => {
			const { sut, checkBatchByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkBatchByIdRepositoryStub,
				"checkById"
			).mockResolvedValue(false);

			const result = await sut.list("invalid_batch_id");

			expect(result).toBeNull();
		});

		it("should call listAnimalsByBatchRepository with the correct id if the batch is valid", async () => {
			const { sut, listAnimalsByBatchRepository } = makeSut();
			const listSpy = jest.spyOn(
				listAnimalsByBatchRepository,
				"listByBatch"
			);

			const fakeBatchId = "fake_batch_id";
			await sut.list(fakeBatchId);

			expect(listSpy).toHaveBeenCalledWith(fakeBatchId);
		});

		it("should return an array of animals if the batch is valid", async () => {
			const { sut } = makeSut();
			const fakeAccountId = "valid_account_id";
			const result = await sut.list(fakeAccountId);

			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(2);
		});
	});
});
