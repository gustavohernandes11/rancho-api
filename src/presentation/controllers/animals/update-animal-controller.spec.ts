import { UpdateAnimalController } from "./update-animal-controller";
import {
	IAnimalModel,
	IDbUpdateAnimal,
	IUpdateAnimalModel,
} from "@data/usecases/update-animal/db-update-animal-protocols";
import { makeUpdateAnimalValidations } from "@main/factories/validation/make-update-animal-validations";
import { InvalidDateFormatError } from "@presentation/errors/invalid-date-format-error";

describe("UpdateAnimalController", () => {
	const mockDate = new Date().toISOString();
	const makeFakeUpdateData = () => ({
		name: "any_name",
		ownerId: "any_ownerId",
		age: mockDate,
	});
	const makeFakeRequest = () => ({
		body: makeFakeUpdateData(),
		animalId: "any_id",
	});

	class DbUpdateAnimalStub implements IDbUpdateAnimal {
		async update(
			id: string,
			props: IUpdateAnimalModel
		): Promise<IAnimalModel | null> {
			return new Promise((resolve) =>
				resolve({
					id: id,
					name: props.name || "any_name",
					ownerId: props.ownerId || "any_ownerId",
					age: props.age || mockDate,
				})
			);
		}
	}

	type ISutTypes = {
		sut: UpdateAnimalController;
		dbUpdateAnimalStub: IDbUpdateAnimal;
	};
	const makeSut = (): ISutTypes => {
		const dbUpdateAnimalStub = new DbUpdateAnimalStub();
		const sut = new UpdateAnimalController(
			makeUpdateAnimalValidations(),
			dbUpdateAnimalStub
		);

		return {
			sut,
			dbUpdateAnimalStub,
		};
	};

	it("should return 200 with the updated animal on successful update", async () => {
		const { sut } = makeSut();
		const request = makeFakeRequest();

		const response = await sut.handle(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			id: "any_id",
			name: "any_name",
			ownerId: "any_ownerId",
			age: mockDate,
		});
	});

	it("should call updateAnimalService with the correct parameters", async () => {
		const { sut, dbUpdateAnimalStub } = makeSut();

		const request = makeFakeRequest();
		const dbUpdateSpy = jest.spyOn(dbUpdateAnimalStub, "update");

		await sut.handle(request);

		expect(dbUpdateSpy).toHaveBeenCalledWith("any_id", {
			name: "any_name",
			ownerId: "any_ownerId",
			age: mockDate,
		});
	});

	it("should return 400 if the age is not in ISO format", async () => {
		const { sut } = makeSut();

		const request = {
			body: {
				name: "any_name",
				ownerId: "any_ownerId",
				age: "INVALID_DATE_FORMAT",
			},
			animalId: "any_id",
		};

		const response = await sut.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(new InvalidDateFormatError("age"));
	});

	it("should return 500 if an error occurs", async () => {
		const { sut, dbUpdateAnimalStub } = makeSut();
		jest.spyOn(dbUpdateAnimalStub, "update").mockRejectedValueOnce(
			new Error()
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(500);
	});
});
