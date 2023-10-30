import { IAddAnimalModel } from "../../../domain/usecases/add-animal";
import { ICheckAccountByIdRepository } from "../../protocols/db/accounts/check-account-by-id-repository";
import { IAddAnimalRepository } from "../../protocols/db/animals/add-animal-repository";
import { DbAddAnimal } from "./db-add-animal";

describe("Db Add Animal", () => {
	const makeFakeAnimal = (): IAddAnimalModel => ({
		name: "any_animal_name",
		ownerId: "any_id",
		age: new Date("12/12/2019"),
	});
	class CheckAccountByIdRepositoryStub
		implements ICheckAccountByIdRepository
	{
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}

	class AddAnimalRepositoryStub implements IAddAnimalRepository {
		async add(account: IAddAnimalModel): Promise<boolean> {
			return true;
		}
	}

	type ISutTypes = {
		sut: DbAddAnimal;
		checkAccountByIdRepositoryStub: CheckAccountByIdRepositoryStub;
		addAnimalRepositoryStub: AddAnimalRepositoryStub;
	};
	const makeSut = (): ISutTypes => {
		const checkAccountByIdRepositoryStub =
			new CheckAccountByIdRepositoryStub();
		const addAnimalRepositoryStub = new AddAnimalRepositoryStub();
		return {
			sut: new DbAddAnimal(
				checkAccountByIdRepositoryStub,
				addAnimalRepositoryStub
			),
			addAnimalRepositoryStub,
			checkAccountByIdRepositoryStub,
		};
	};

	describe("Add()", () => {
		it("should call the checkAccountByRepository", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			const checkByIdSpy = jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			);
			await sut.add(makeFakeAnimal());
			expect(checkByIdSpy).toHaveBeenCalled();
		});
		it("should return false if the owner do not exists", async () => {
			const { sut, checkAccountByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkAccountByIdRepositoryStub,
				"checkById"
			).mockImplementationOnce(
				() => new Promise((resolve) => resolve(false))
			);
			const result = await sut.add(makeFakeAnimal());
			expect(result).toBeFalsy();
		});
		it("should call the addAnimalRepository", async () => {
			const { sut, addAnimalRepositoryStub } = makeSut();
			const addRepoSpy = jest.spyOn(addAnimalRepositoryStub, "add");
			await sut.add(makeFakeAnimal());
			expect(addRepoSpy).toHaveBeenCalled();
		});
		it("should return true if the animal was added", async () => {
			const { sut } = makeSut();
			const result = await sut.add(makeFakeAnimal());
			expect(result).toBeTruthy();
		});
	});
});
