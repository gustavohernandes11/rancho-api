import {
	loginPath,
	signUpPath,
	animalsPath,
	animalPath,
	batchPath,
	batchesPath,
	batchInfoPath,
} from "./paths/";

export default {
	"/login": loginPath,
	"/signup": signUpPath,
	"/animals/{animalId}": animalPath,
	"/animals": animalsPath,
	"/batches/{batchId}/info": batchInfoPath,
	"/batches/{batchId}": batchPath,
	"/batches": batchesPath,
};
