import { ValidationComposite } from "@validation/validators";
import { GlobalDateFormatValidation } from "@validation/validators/global-date-field-validation";

export const makeRemoveAnimalValidations = () => {
	const validations = [new GlobalDateFormatValidation("age")];

	return new ValidationComposite(validations);
};
