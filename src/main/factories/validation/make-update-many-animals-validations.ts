import {
	RequiredFieldValidation,
	ValidationComposite,
} from "@/validation/validators";
import { GlobalDateFormatValidation } from "@/validation/validators/global-date-field-validation";

export const makeUpdateManyAnimalsValidations = () => {
	const validations = [
		new RequiredFieldValidation("id"),
		new GlobalDateFormatValidation("age"),
	];

	return new ValidationComposite(validations);
};
