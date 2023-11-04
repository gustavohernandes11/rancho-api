import { IListAnimalsByOwnerIdRepository } from "@data/protocols/db/animals/list-animals-by-owner-repository";
import { IDbListAnimals } from "@domain/usecases/list-animals";
import { ICheckAccountByIdRepository } from "../add-animal/db-add-animal-protocols";
import { IAnimalModel } from "../update-animal/db-update-animal-protocols";
import { DbListAnimals } from "./db-list-animals";

describe("DbListAnimal", () => {
	class ListAnimalsByOwnerIdRepositoryStub
		implements IListAnimalsByOwnerIdRepository
	{
		async listAnimals(ownerId: string): Promise<IAnimalModel[]> {
			return [
				{
					id: "animal_id_1",
					ownerId: ownerId,
					age: new Date("2020-01-01"),
					name: "animal_1",
				},
				{
					id: "animal_id_2",
					ownerId: ownerId,
					age: new Date("2019-01-01"),
					name: "animal_2",
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
		sut: IDbListAnimals;
		listAnimalsByOwnerIdRepositoryStub: ListAnimalsByOwnerIdRepositoryStub;
		checkAccountByIdRepositoryStub: CheckAccountByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const listAnimalsByOwnerIdRepositoryStub =
			new ListAnimalsByOwnerIdRepositoryStub();
		const checkAccountByIdRepositoryStub =
			new CheckAccountByIdRepositoryStub();
		const sut = new DbListAnimals(
			listAnimalsByOwnerIdRepositoryStub,
			checkAccountByIdRepositoryStub
		);
		return {
			sut,
			listAnimalsByOwnerIdRepositoryStub,
			checkAccountByIdRepositoryStub,
		};
	};

	describe("load", () => {
		it("should call checkAccountByIdRepository with the correct account ID", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			const checkSpy = jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			);

			const fakeAccountId = "valid_account_id";
			await sut.load(fakeAccountId);

			expect(checkSpy).toHaveBeenCalledWith(fakeAccountId);
		});

		it("should return null if the account is not valid", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			).mockResolvedValue(false);

			const result = await sut.load("invalid_account_id");

			expect(result).toBeNull();
		});

		it("should call listAnimalsByOwnerIdRepository with the correct owner ID if the account is valid", async () => {
			const { sut, listAnimalsByOwnerIdRepositoryStub } = makeSut();
			const listSpy = jest.spyOn(
				listAnimalsByOwnerIdRepositoryStub,
				"listAnimals"
			);

			const fakeAccountId = "valid_account_id";
			await sut.load(fakeAccountId);

			expect(listSpy).toHaveBeenCalledWith(fakeAccountId);
		});

		it("should return an array of animals if the account is valid", async () => {
			const { sut } = makeSut();
			const fakeAccountId = "valid_account_id";
			const result = await sut.load(fakeAccountId);

			expect(Array.isArray(result)).toBe(true);
			expect(result?.length).toBeGreaterThan(0);
		});
	});
});
