export class InvalidParamError extends Error {
	constructor(param: string) {
		super(`missing param: ${param}`);
		this.name = "MissingParamError";
	}
}
