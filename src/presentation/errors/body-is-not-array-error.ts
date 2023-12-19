export class BodyIsNotArrayError extends Error {
	constructor() {
		super("Body should be provided as array for this route");
		this.name = "BodyIsNotArrayError";
	}
}
