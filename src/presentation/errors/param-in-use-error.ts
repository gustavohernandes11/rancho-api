export class ParamInUseError extends Error {
	constructor(param: string) {
		super(`${param} is already in use`);
		this.name = "ParamInUseError";
	}
}
