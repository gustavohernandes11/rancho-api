import { IDbAddAnimal, IAddAnimalModel } from "@/domain/usecases/add-animal";
import { makeAddAnimalValidations } from "@/main/factories/validation/make-add-animal-validations";
import { InvalidParamValue, MissingParamError } from "../../errors";
import { ok } from "../../helpers/http-helpers";
import { AddAnimalController } from "./add-animal-controller";
import { IHttpRequest } from "@/presentation/protocols";

const mockAddAnimalRequest = (bodyOverride?: any): IHttpRequest => {
	return {
		body: Object.assign(
			{
				name: "any_animal_name",
				ownerId: "any_id",
				gender: "F",
				age: new Date("12/12/2019").toISOString(),
			},
			bodyOverride || {}
		),
	};
};

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
	describe("DbAddAnimal", () => {
		it("should call the DbAddAnimal", async () => {
			const { sut, dbAddAnimalStub } = makeSut();
			const dbAddSpy = jest.spyOn(dbAddAnimalStub, "add");

			await sut.handle(mockAddAnimalRequest());
			expect(dbAddSpy).toHaveBeenCalled();
		});

		it("should return 500 if DbAddAnimal throws", async () => {
			const { sut, dbAddAnimalStub } = makeSut();
			jest.spyOn(dbAddAnimalStub, "add").mockImplementationOnce(() => {
				throw new Error();
			});

			const result = await sut.handle(mockAddAnimalRequest());

			expect(result.statusCode).toBe(500);
		});
	});
	describe("Validations", () => {
		it("should return 400 when no animal name is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle(
				mockAddAnimalRequest({ name: undefined })
			);

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("name"));
		});
		it("should return 400 when no animal age is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle(
				mockAddAnimalRequest({ age: undefined })
			);

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("age"));
		});
		it("should return 400 when no animal gender is provided", async () => {
			const { sut } = makeSut();
			const response = await sut.handle(
				mockAddAnimalRequest({ gender: undefined })
			);

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(new MissingParamError("gender"));
		});
		it("should return 400 when gender is provided with invalid value", async () => {
			const { sut } = makeSut();
			const response = await sut.handle(
				mockAddAnimalRequest({ gender: "INVALID_VALUE" })
			);

			expect(response.statusCode).toBe(400);
			expect(response.body).toEqual(
				new InvalidParamValue("gender", ["F", "M"])
			);
		});
	});
	it("should return 200 when the data is correct added", async () => {
		const { sut } = makeSut();
		const response = await sut.handle(mockAddAnimalRequest());

		expect(response.statusCode).toBe(200);
		expect(response).toEqual(ok());
	});
});
