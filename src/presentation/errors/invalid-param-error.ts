export class InvalidParamError extends Error {
	constructor(param: string) {
		super(`O campo "${param}" é inválido`);
		this.name = "InvalidParamError";
	}
}
