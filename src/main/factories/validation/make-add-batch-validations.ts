import {
	RequiredFieldValidation,
	ValidationComposite,
} from "@/validation/validators";

export const makeAddBatchValidations = () => {
	const validations = [new RequiredFieldValidation("name")];

	return new ValidationComposite(validations);
};
