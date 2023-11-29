import { IDbAddAnimal, IAddAnimalModel } from "@/domain/usecases/add-animal";
import { makeAddAnimalValidations } from "@/main/factories/validation/make-add-animal-validations";
import { MissingParamError } from "../../errors";
import { ok } from "../../helpers/http-helpers";
import { AddAnimalController } from "./add-animal-controller";

describe("Add Animal Controller", () => {
	class DbAddAnimalStub implements IDbAddAnimal {
		async add(animal: IAddAnimalModel): Promise<boolean> {
			return true;
		}
	}

	interface ISutTypes {
		sut: AddAnimalController;
		dbAddAnimalStub: DbAddAnimalStub;
	}
	const makeSut = (): ISutTypes => {
		const loginValidations = makeAddAnimalValidations();
		const dbAddAnimalStub = new DbAddAnimalStub();
		const sut = new AddAnimalController(loginValidations, dbAddAnimalStub);
		return { sut, dbAddAnimalStub };
	};
	const makeFakeRequest = () => ({
		body: {
			name: "any_animal_name",
			ownerId: "any_id",
			age: new Date("12/12/2019").toISOString(),
		},
	});
	describe("DbAddAnimal", () => {
		it("should call the DbAddAnimal", async () => {
			const { sut, dbAddAnimalStub } = makeSut();
			const dbAddSpy = jest.spyOn(dbAddAnimalStub, "add");

			await sut.handle(makeFakeRequest());
			expect(dbAddSpy).toHaveBeenCalled();
		});

		it("should return 500 if DbAddAnimal throws", async () => {
			const { sut, dbAddAnimalStub } = makeSut();
			jest.spyOn(dbAddAnimalStub, "add").mockImplementationOnce(() => {
				throw new Error();
			});

			const result = await sut.handle(makeFakeRequest());

			expect(result.statusCode).toBe(500);
		});
	});
	describe("Validations", () => {
		it("should return 400 when no animal name is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle({
				body: { ownerId: "any_id", age: new Date("12/12/2019") },
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("name"));
		});
		it("should return 400 when no animal age is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle({
				body: {
					name: "any_animal_name",
					ownerId: "any_id",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("age"));
		});
	});
	it("should return 200 when the data is correct added", async () => {
		const { sut } = makeSut();
		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(200);
		expect(response).toEqual(ok());
	});
});
