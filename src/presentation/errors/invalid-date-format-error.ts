export class InvalidDateFormatError extends Error {
	constructor(param: string) {
		super(`date format should be ISO 8601: ${param}`);
		this.name = "InvalidDateFormatError";
	}
}
