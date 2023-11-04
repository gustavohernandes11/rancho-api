export class InvalidDateFormatError extends Error {
	constructor(param: string) {
		super(`invalid Date format: ${param}`);
		this.name = "InvalidDateFormatError";
	}
}
