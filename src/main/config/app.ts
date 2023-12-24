import express, { Express } from "express";
import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";
import setupSwagger from "./swagger";

export const setupApp = async (): Promise<Express> => {
	const app = express();

	setupMiddlewares(app);
	setupRoutes(app);
	setupSwagger(app);

	return app;
};
