export class MissingParamInListError extends Error {
	constructor(params: string[]) {
		super(`Pelo menos um desses campos é requerido: ${params.join(",")}`);
		this.name = "MissingParamInListError";
	}
}
