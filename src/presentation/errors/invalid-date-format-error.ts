export class InvalidDateFormatError extends Error {
	constructor(param: string) {
		super(`O formato de datas deve ser ISO8601: ${param}`);
		this.name = "InvalidDateFormatError";
	}
}
