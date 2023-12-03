import {
	RequiredFieldValidation,
	ValidationComposite,
} from "@/validation/validators";
import { AllowedFieldValueOptions } from "@/validation/validators/allowed-field-value-options";
import { GlobalDateFormatValidation } from "@/validation/validators/global-date-field-validation";

export const makeAddAnimalValidations = () => {
	const validations = [
		new RequiredFieldValidation("name"),
		new RequiredFieldValidation("age"),
		new GlobalDateFormatValidation("age"),
		new RequiredFieldValidation("gender"),
		new AllowedFieldValueOptions("gender", ["F", "M"]),
	];

	return new ValidationComposite(validations);
};
