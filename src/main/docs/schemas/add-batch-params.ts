export const addBatchParamsSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		observation: {
			type: "string",
		},
	},
	required: ["name"],
};

export interface IAddBatchModel {
	name: string;
	observation?: string;
}
