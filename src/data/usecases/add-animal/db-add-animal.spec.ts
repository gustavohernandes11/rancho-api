import { ICheckAnimalByIdRepository } from "@/data/protocols/db/animals/check-animal-by-id-repository";
import { DbAddAnimal } from "./db-add-animal";
import {
	IAddAnimalModel,
	IAddAnimalRepository,
	ICheckAccountByIdRepository,
} from "./db-add-animal-protocols";

describe("Db Add Animal", () => {
	const makeFakeAnimal = (): IAddAnimalModel => ({
		name: "any_animal_name",
		ownerId: "any_id",
		age: new Date("12/12/2019").toISOString(),
	});
	class CheckAccountByIdRepositoryStub
		implements ICheckAccountByIdRepository
	{
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}
	class CheckAnimalByIdRepositoryStub implements ICheckAnimalByIdRepository {
		async checkById(id: string): Promise<boolean> {
			return true;
		}
	}

	class AddAnimalRepositoryStub implements IAddAnimalRepository {
		async addAnimal(account: IAddAnimalModel): Promise<boolean> {
			return true;
		}
	}

	type ISutTypes = {
		sut: DbAddAnimal;
		checkAccountByIdRepositoryStub: CheckAccountByIdRepositoryStub;
		addAnimalRepositoryStub: AddAnimalRepositoryStub;
		checkAnimalByIdRepositoryStub: CheckAnimalByIdRepositoryStub;
	};
	const makeSut = (): ISutTypes => {
		const checkAccountByIdRepositoryStub =
			new CheckAccountByIdRepositoryStub();
		const checkAnimalByIdRepositoryStub =
			new CheckAnimalByIdRepositoryStub();
		const addAnimalRepositoryStub = new AddAnimalRepositoryStub();
		return {
			sut: new DbAddAnimal(
				checkAccountByIdRepositoryStub,
				checkAnimalByIdRepositoryStub,
				addAnimalRepositoryStub
			),
			addAnimalRepositoryStub,
			checkAnimalByIdRepositoryStub,
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
			const addRepoSpy = jest.spyOn(addAnimalRepositoryStub, "addAnimal");
			await sut.add(makeFakeAnimal());
			expect(addRepoSpy).toHaveBeenCalled();
		});
		it("should call the checkAnimalByIdRepositoryStub when the animal has a paternityId prop", async () => {
			const { sut, checkAnimalByIdRepositoryStub } = makeSut();
			const checkAnimalSpy = jest.spyOn(
				checkAnimalByIdRepositoryStub,
				"checkById"
			);
			await sut.add({ ...makeFakeAnimal(), paternityId: "any_id" });
			expect(checkAnimalSpy).toHaveBeenCalled();
		});
		it("should call the checkAnimalByIdRepositoryStub when the animal has a maternityId prop", async () => {
			const { sut, checkAnimalByIdRepositoryStub } = makeSut();
			const checkAnimalSpy = jest.spyOn(
				checkAnimalByIdRepositoryStub,
				"checkById"
			);
			await sut.add({ ...makeFakeAnimal(), maternityId: "any_id" });
			expect(checkAnimalSpy).toHaveBeenCalled();
		});
		it("should return false when checking paternity and maternity id return false", async () => {
			const { sut, checkAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				checkAnimalByIdRepositoryStub,
				"checkById"
			).mockReturnValueOnce(Promise.resolve(false));

			const result = await sut.add({
				...makeFakeAnimal(),
				paternityId: "invalid_id",
			});
			expect(result).toBeFalsy();
		});

		it("should return true if the animal was added", async () => {
			const { sut } = makeSut();
			const result = await sut.add(makeFakeAnimal());
			expect(result).toBeTruthy();
		});
	});
});
