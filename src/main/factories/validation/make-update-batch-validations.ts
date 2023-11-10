import { IValidation } from "@/presentation/protocols";
import { ValidationComposite } from "@/validation/validators";
import { AtLeastOneOfTheseFieldsValidation } from "@/validation/validators/at-least-one-of-these-fields-validation";

export const makeUpdateBatchValidations = () => {
	const validations: IValidation[] = [];

	validations.push(
		new AtLeastOneOfTheseFieldsValidation(["ownerId", "name"])
	);

	return new ValidationComposite(validations);
};
