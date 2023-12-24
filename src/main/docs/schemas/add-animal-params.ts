export const addAnimalParamsSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		gender: {
			type: "string",
			enum: ["F", "M"],
		},
		age: {
			type: "string",
		},
		observation: {
			type: "string",
		},
		code: {
			type: "string",
		},
		maternityId: {
			type: "string",
		},
		paternityId: {
			type: "string",
		},
		batchId: {
			type: "string",
		},
	},
	required: ["age", "gender", "name"],
};
