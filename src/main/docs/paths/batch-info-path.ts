export const batchInfoPath = {
	get: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Batches"],
		summary: "API para listar informações sobre um lote",
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
							$ref: "#/schemas/batchInfo",
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
