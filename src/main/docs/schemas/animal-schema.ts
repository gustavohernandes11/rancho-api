export const animal = {
	type: "object",
	properties: {
		id: {
			type: "string",
		},
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
