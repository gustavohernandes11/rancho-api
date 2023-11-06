import { RemoveAnimalController } from "./remove-animal-controller";
import { InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http-helpers";
import { IDbRemoveAnimal } from "@domain/usecases/remove-animal";
import { IController, IValidation } from "@presentation/protocols";

describe("Remove Animal Controller", () => {
	const makeFakeRequest = () => ({
		animalId: "valid_id",
		body: {},
	});

	class DbRemoveAnimalStub implements IDbRemoveAnimal {
		async remove() {
			return true;
		}
	}
	class ValidationStub implements IValidation {
		validate(input: any) {
			return;
		}
	}

	type ISutTypes = {
		sut: IController;
		validationStub: IValidation;
		dbRemoveAnimalStub: IDbRemoveAnimal;
	};

	const makeSut = (): ISutTypes => {
		const validationStub = new ValidationStub();
		const dbRemoveAnimalStub = new DbRemoveAnimalStub();
		const sut = new RemoveAnimalController(
			validationStub,
			dbRemoveAnimalStub
		);

		return {
			sut,
			validationStub,
			dbRemoveAnimalStub,
		};
	};
	it("should return 200 if the removal is successful", async () => {
		const { sut } = makeSut();
		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(ok());
	});

	it("should return 400 if validation fails", async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, "validate").mockReturnValue(
			new InvalidParamError("animalId")
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(badRequest(new InvalidParamError("animalId")));
	});

	it("should call dbRemoveAnimal with the correct parameters", async () => {
		const { sut, dbRemoveAnimalStub } = makeSut();
		const removeSpy = jest.spyOn(dbRemoveAnimalStub, "remove");

		const response = await sut.handle(makeFakeRequest());

		expect(removeSpy).toHaveBeenCalledWith("valid_id");
		expect(response).toEqual(ok());
	});

	it("should return 400 if dbRemoveAnimal returns false", async () => {
		const { sut, dbRemoveAnimalStub } = makeSut();
		jest.spyOn(dbRemoveAnimalStub, "remove").mockReturnValueOnce(
			Promise.resolve(false)
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response).toEqual(badRequest(new InvalidParamError("animalId")));
	});

	it("should return 500 if an error occurs in dbRemoveAnimal", async () => {
		const { sut, dbRemoveAnimalStub } = makeSut();
		jest.spyOn(dbRemoveAnimalStub, "remove").mockImplementationOnce(() => {
			throw new Error();
		});

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(500);
	});
});
