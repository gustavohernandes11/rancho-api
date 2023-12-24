import { Express } from "express";
import { serve, setup } from "swagger-ui-express";
import { noCache } from "@/main/middlewares/no-cache";
import swaggerConfig from "@/main/docs";

export default (app: Express) => {
	app.use("/docs", noCache, serve, setup(swaggerConfig));
};
