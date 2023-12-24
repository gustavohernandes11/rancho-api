import {
	accountSchema,
	loginParamsSchema,
	errorSchema,
	signUpParamsSchema,
	addAnimalParamsSchema,
	batchInfoSchema,
	editAnimalWithIdParams,
} from "./schemas/";
import { addBatchParamsSchema } from "./schemas/add-batch-params";

export default {
	account: accountSchema,
	loginParams: loginParamsSchema,
	signUpParams: signUpParamsSchema,
	error: errorSchema,
	animal: addAnimalParamsSchema,
	editAnimal: addAnimalParamsSchema,
	batch: addBatchParamsSchema,
	editBatch: addBatchParamsSchema,
	batchInfo: batchInfoSchema,
	editAnimalWithId: editAnimalWithIdParams,
};
