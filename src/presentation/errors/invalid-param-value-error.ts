export class InvalidParamValue extends Error {
	constructor(param: string, allowedValues: string[]) {
		super(
			`O parâmetro ${param} deve ter apenas um desses valores: ${allowedValues.join(
				" ,"
			)}`
		);
		this.name = "InvalidParamValueError";
	}
}
