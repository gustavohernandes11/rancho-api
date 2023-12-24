export const batchesPath = {
	get: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Batches"],
		summary: "API para listar informações de todos os lotes",
		description: "Rota para usuários autenticados.",
		responses: {
			200: {
				description: "Sucesso",
				content: {
					"application/json": {
						schema: {
							type: "array",
							items: {
								$ref: "#/schemas/batch",
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
		tags: ["Batches"],
		summary: "API para adicionar um lote",
		description: "Rota para usuários autenticados.",
		parameters: [
			{
				in: "path",
				name: "batchId",
				description: "ID do lote em específico",
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
							$ref: "#/schemas/batch",
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
};
