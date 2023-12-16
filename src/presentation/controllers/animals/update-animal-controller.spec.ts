import { UpdateAnimalController } from "./update-animal-controller";
import {
	IAnimalModel,
	IDbUpdateAnimal,
	IUpdateAnimalModel,
} from "@/data/usecases/update-animal/db-update-animal-protocols";
import { makeUpdateAnimalValidations } from "@/main/factories/validation/make-update-animal-validations";
import { InvalidDateFormatError } from "@/presentation/errors/invalid-date-format-error";

const mockDate = new Date().toISOString();
export const mockUpdateAnimalData = (): IUpdateAnimalModel => ({
	name: "any_name",
	gender: "F",
	age: mockDate,
	paternityId: "any_paternity_id",
	maternityId: "any_maternity_id",
	batchId: "any_batch_id",
	code: 123,
	observation: "any_observation",
	ownerId: "any_ownerId",
});
const mockAnimalUpdateRequest = (bodyOverride?: IUpdateAnimalModel) => {
	return {
		animalId: "any_animal_id",
		accountId: "any_ownerId",
		body: Object.assign(mockUpdateAnimalData(), bodyOverride || {}),
	};
};

describe("UpdateAnimalController", () => {
	class DbUpdateAnimalStub implements IDbUpdateAnimal {
		async update(
			id: string,
			props: IUpdateAnimalModel
		): Promise<IAnimalModel | null> {
			return new Promise((resolve) =>
				resolve(
					Object.assign(mockUpdateAnimalData(), props, {
						id,
					}) as IAnimalModel
				)
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
		const request = mockAnimalUpdateRequest();

		const response = await sut.handle(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			...mockUpdateAnimalData(),
			id: "any_animal_id",
		});
	});

	it("should call updateAnimalService with the correct parameters", async () => {
		const { sut, dbUpdateAnimalStub } = makeSut();

		const request = mockAnimalUpdateRequest();
		const dbUpdateSpy = jest.spyOn(dbUpdateAnimalStub, "update");

		await sut.handle(request);

		expect(dbUpdateSpy).toHaveBeenCalledWith(
			"any_animal_id",
			mockUpdateAnimalData()
		);
	});

	it("should return 400 if the age is not in ISO format", async () => {
		const { sut } = makeSut();

		const response = await sut.handle(
			mockAnimalUpdateRequest({ age: "INVALID_DATA_FORMAT" })
		);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(new InvalidDateFormatError("age"));
	});

	it("should return 500 if an error occurs", async () => {
		const { sut, dbUpdateAnimalStub } = makeSut();
		jest.spyOn(dbUpdateAnimalStub, "update").mockRejectedValueOnce(
			new Error()
		);

		const response = await sut.handle(mockAnimalUpdateRequest());

		expect(response.statusCode).toBe(500);
	});
});
