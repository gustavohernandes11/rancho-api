import { IAnimalModel } from "@/data/usecases/update-animal/db-update-animal-protocols";
import {
	IDbUpdateManyAnimals,
	IUpdateManyAnimalsProps,
} from "@/domain/usecases/update-many-animals";
import { makeUpdateManyAnimalsValidations } from "@/main/factories/validation/make-update-many-animals-validations";
import { InvalidDateFormatError } from "@/presentation/errors/invalid-date-format-error";
import { UpdateManyAnimalsController } from "./update-many-animals-controller";

describe("UpdateManyAnimalsController", () => {
	const mockDate = new Date().toISOString();
	const mockUpdateAnimalData = (
		overrideId?: string,
		overrideProps?: any
	): IUpdateManyAnimalsProps => {
		return {
			id: overrideId || "1",
			props: Object.assign(
				{
					name: "any_name_updated_1",
					gender: "M",
					age: mockDate,
					paternityId: "any_paternity_id_updated",
					maternityId: "any_maternity_id_updated",
					batchId: "any_batch_id_updated",
					code: 123,
					observation: "any_observation_updated",
					ownerId: "any_ownerId_updated",
				},
				overrideProps || {}
			),
		};
	};
	const makeFakeUpdateArray = (): IUpdateManyAnimalsProps[] => {
		return [
			mockUpdateAnimalData("id_1"),
			mockUpdateAnimalData("id_2"),
			mockUpdateAnimalData("id_3"),
		];
	};

	const makeFakeRequest = () => ({
		body: makeFakeUpdateArray(),
		accountId: "any_ownerId",
	});

	class DbUpdateManyAnimalsStub implements IDbUpdateManyAnimals {
		async updateMany(
			animals: IUpdateManyAnimalsProps[]
		): Promise<(IAnimalModel | null)[]> {
			const resolvedAnimals = animals.map(
				(al) =>
					Object.assign(mockUpdateAnimalData(), al.props, {
						id: al.id,
					}) as IAnimalModel
			);
			return new Promise((resolve) => resolve(resolvedAnimals));
		}
	}

	type ISutTypes = {
		sut: UpdateManyAnimalsController;
		dbUpdateManyAnimalsStub: IDbUpdateManyAnimals;
	};
	const makeSut = (): ISutTypes => {
		const dbUpdateManyAnimalsStub = new DbUpdateManyAnimalsStub();
		const sut = new UpdateManyAnimalsController(
			makeUpdateManyAnimalsValidations(),
			dbUpdateManyAnimalsStub
		);

		return {
			sut,
			dbUpdateManyAnimalsStub,
		};
	};

	it("should return 200 with the updated animal on successful update", async () => {
		const { sut } = makeSut();
		const request = makeFakeRequest();

		const response = await sut.handle(request);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining(mockUpdateAnimalData("id_1")),
				expect.objectContaining(mockUpdateAnimalData("id_2")),
				expect.objectContaining(mockUpdateAnimalData("id_3")),
			])
		);
	});

	it("should call updateAnimalService with the correct parameters", async () => {
		const { sut, dbUpdateManyAnimalsStub } = makeSut();

		const request = makeFakeRequest();
		const dbUpdateSpy = jest.spyOn(dbUpdateManyAnimalsStub, "updateMany");

		await sut.handle(request);

		expect(dbUpdateSpy).toHaveBeenCalledWith([
			mockUpdateAnimalData("id_1"),
			mockUpdateAnimalData("id_2"),
			mockUpdateAnimalData("id_3"),
		]);
	});

	it("should return 400 if the body is not a array", async () => {
		const { sut } = makeSut();

		const request = {
			body: {
				name: "any_name",
				ownerId: "any_ownerId",
				gender: "F",
				age: "any_date",
			},
			animalId: "any_id",
		};

		const response = await sut.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(
			new Error("Body should be provided as array")
		);
	});

	it("should return 400 if the age is not in ISO format", async () => {
		const { sut } = makeSut();

		const request = {
			body: [
				{
					id: "any_id",
					props: {
						name: "any_name",
						ownerId: "any_ownerId",
						gender: "F",
						age: "INVALID_DATE_FORMAT",
					},
				},
			],
		};

		const response = await sut.handle(request);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(new InvalidDateFormatError("age"));
	});

	it("should return 500 if an error occurs", async () => {
		const { sut, dbUpdateManyAnimalsStub } = makeSut();
		jest.spyOn(dbUpdateManyAnimalsStub, "updateMany").mockRejectedValueOnce(
			new Error()
		);

		const response = await sut.handle(makeFakeRequest());

		expect(response.statusCode).toBe(500);
	});
});
