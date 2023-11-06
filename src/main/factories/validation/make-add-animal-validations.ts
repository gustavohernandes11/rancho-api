import {
	RequiredFieldValidation,
	ValidationComposite,
} from "@validation/validators";
import { GlobalDateFormatValidation } from "@validation/validators/global-date-field-validation";

export const makeAddAnimalValidations = () => {
	const validations = [
		new RequiredFieldValidation("name"),
		new RequiredFieldValidation("ownerId"),
		new RequiredFieldValidation("age"),
		new GlobalDateFormatValidation("age"),
	];

	return new ValidationComposite(validations);
};
