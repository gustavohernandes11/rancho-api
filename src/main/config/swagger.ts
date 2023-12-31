import { Express } from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerConfig from "@/main/docs";
import { noCache } from "../middlewares";

export default (app: Express) => {
	app.use("/docs", noCache, serve, setup(swaggerConfig));
};
