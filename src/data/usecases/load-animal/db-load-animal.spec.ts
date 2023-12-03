import { ILoadAnimalByIdRepository } from "@/data/protocols/db/animals/load-animal-by-id-repository";
import { IAnimalModel } from "../update-animal/db-update-animal-protocols";
import { IDbLoadAnimal } from "@/domain/usecases/load-animal";
import { DbLoadAnimal } from "./db-load-animal";

describe("DbLoadAnimals", () => {
	class LoadAnimalByIdRepositoryStub implements ILoadAnimalByIdRepository {
		async loadAnimal(id: string): Promise<IAnimalModel | null> {
			return {
				id: id,
				ownerId: "owner_id",
				gender: "F",
				age: new Date("2020-01-01").toISOString(),
				name: "sample_animal",
			};
		}
	}

	type SutTypes = {
		sut: IDbLoadAnimal;
		loadAnimalByIdRepositoryStub: LoadAnimalByIdRepositoryStub;
	};

	const makeSut = (): SutTypes => {
		const loadAnimalByIdRepositoryStub = new LoadAnimalByIdRepositoryStub();
		const sut = new DbLoadAnimal(loadAnimalByIdRepositoryStub);
		return {
			sut,
			loadAnimalByIdRepositoryStub,
		};
	};

	describe("load", () => {
		it("should call loadAnimalByIdRepository with the correct ID", async () => {
			const { sut, loadAnimalByIdRepositoryStub } = makeSut();
			const loadSpy = jest.spyOn(
				loadAnimalByIdRepositoryStub,
				"loadAnimal"
			);

			const fakeAnimalId = "existing_id";
			await sut.load(fakeAnimalId);

			expect(loadSpy).toHaveBeenCalledWith(fakeAnimalId);
		});

		it("should return the loaded animal if it exists", async () => {
			const { sut } = makeSut();
			const fakeAnimalId = "existing_id";
			const result = await sut.load(fakeAnimalId);

			expect(result).toEqual(
				expect.objectContaining({ id: fakeAnimalId })
			);
		});

		it("should return null if the animal does not exist", async () => {
			const { sut, loadAnimalByIdRepositoryStub } = makeSut();
			jest.spyOn(
				loadAnimalByIdRepositoryStub,
				"loadAnimal"
			).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

			const fakeAnimalId = "non_existing_id";
			const result = await sut.load(fakeAnimalId);

			expect(result).toBeNull();
		});
	});
});
