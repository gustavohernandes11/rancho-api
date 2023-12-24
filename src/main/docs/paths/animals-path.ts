export const animalsPath = {
	get: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Animals"],
		summary: "API para listar todos os animais",
		description: "Rota para usuários autenticados.",
		responses: {
			200: {
				description: "Sucesso",
				content: {
					"application/json": {
						schema: {
							type: "array",
							items: {
								$ref: "#/schemas/animal",
							},
						},
					},
				},
			},
			204: {
				description: "Sucesso, mas sem conteúdo",
			},
			403: {
				$ref: "#/components/forbidden",
			},
			404: {
				$ref: "#/components/notFound",
			},
			500: {
				$ref: "#/components/serverError",
			},
		},
	},
	post: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Animals"],
		summary: "API para adicionar um animal",
		description: "Rota para usuários autenticados.",
		parameters: [
			{
				in: "path",
				name: "animalId",
				description: "ID do animal em específico",
				required: true,
				schema: {
					type: "string",
				},
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						$ref: "#/schemas/animal",
					},
				},
			},
		},
		responses: {
			200: {
				description: "Sucesso",
				content: {
					"application/json": {
						schema: {
							type: "object",
							$ref: "#/schemas/animal",
						},
					},
				},
			},
			204: {
				description: "Sucesso, mas sem conteúdo",
			},
			403: {
				$ref: "#/components/forbidden",
			},
			404: {
				$ref: "#/components/notFound",
			},
			500: {
				$ref: "#/components/serverError",
			},
		},
	},
	put: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Animals"],
		summary: "API para atualizar vários animais",
		description: "Rota para usuários autenticados.",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							$ref: "#/schemas/editAnimalWithId",
						},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Sucesso",
			},
			204: {
				description: "Sucesso, mas sem conteúdo",
			},
			403: {
				$ref: "#/components/forbidden",
			},
			404: {
				$ref: "#/components/notFound",
			},
			500: {
				$ref: "#/components/serverError",
			},
		},
	},
};
