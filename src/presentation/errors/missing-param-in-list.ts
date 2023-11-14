export class MissingParamInListError extends Error {
	constructor(params: string[]) {
		super(`missing at least one of these params: ${params.join(",")}`);
		this.name = "MissingParamInListError";
	}
}
