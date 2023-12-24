import components from "./components";
import paths from "./paths";
import schemas from "./schemas";

export default {
	openapi: "3.0.0",
	info: {
		title: "Rancho - API para gerenciamento de gado",
		description: "Backend para o projeto Rancho.",
		version: "1.0.0",
		contact: {
			name: "Gustavo Hernandes da Silva",
			email: "gustavo.hernandes.s11@gmail.com",
		},
		license: {
			name: "Creative Commons Attribution Non Commercial 1.0 Generic",
			url: "https://spdx.org/licenses/CC-BY-NC-1.0.html",
		},
	},
	servers: [
		{
			url: "/api",
			description: "API principal",
		},
	],
	tags: [
		{
			name: "Login",
			description: "APIs relacionadas a autenticação",
		},
		{
			name: "Animals",
			description: "APIs relacionadas a animais",
		},
		{
			name: "Batches",
			description: "APIs relacionadas a lotes de animais",
		},
	],
	paths,
	schemas,
	components,
};
