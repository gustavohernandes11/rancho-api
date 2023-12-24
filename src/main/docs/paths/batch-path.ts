export const batchPath = {
	get: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Batches"],
		summary: "API para listar todos os animais do lote",
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
	put: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Batches"],
		summary: "API para atualizar informações de um lote",
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
							$ref: "#/schemas/editBatch",
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
	delete: {
		security: [
			{
				apiKeyAuth: [],
			},
		],
		tags: ["Batches"],
		summary: "API para deletar um lote (sem deletar seus animais).",
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
