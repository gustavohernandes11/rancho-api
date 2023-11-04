export class InvalidUTCFormatError extends Error {
	constructor(param: string) {
		super(`invalid UTC format: ${param}`);
		this.name = "InvalidUTCFormatError";
	}
}
