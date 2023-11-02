import {
	RequiredFieldValidation,
	ValidationComposite,
} from "@validation/validators";

export const makeAddAnimalValidations = () => {
	const validations = [
		new RequiredFieldValidation("name"),
		new RequiredFieldValidation("ownerId"),
		new RequiredFieldValidation("age"),
	];

	return new ValidationComposite(validations);
};
