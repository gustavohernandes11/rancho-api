export class ParamInUseError extends Error {
	constructor(param: string) {
		super(`${param} Já está em uso`);
		this.name = "ParamInUseError";
	}
}
