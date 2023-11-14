import {
	RequiredFieldValidation,
	ValidationComposite,
} from "@validation/validators";

export const makeAddBatchValidations = () => {
	const validations = [
		new RequiredFieldValidation("name"),
		new RequiredFieldValidation("ownerId"),
	];

	return new ValidationComposite(validations);
};
