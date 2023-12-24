export const animalPath = {
	get: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Animals"],
		summary: "API para listar informações sobre um animal",
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
		summary: "API para atualizar um animal",
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
						$ref: "#/schemas/editAnimal",
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
	delete: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Animals"],
		summary: "API para deleter um animal",
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
