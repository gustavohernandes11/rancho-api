export class EmailInUseError extends Error {
	constructor() {
		super("email is already in use");
		this.name = "EmailInUseError";
	}
}
