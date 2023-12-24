export const editBatchParamsSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		observation: {
			type: "string",
		},
	},
};

export interface IAddBatchModel {
	name: string;
	observation?: string;
}
