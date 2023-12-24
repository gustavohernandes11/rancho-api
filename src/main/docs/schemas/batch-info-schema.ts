export const batchInfoSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		observation: {
			type: "string",
			optional: true,
		},
		count: {
			type: "number",
		},
	},
	required: ["name", "count"],
};
