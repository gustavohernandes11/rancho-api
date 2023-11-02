import { Middleware } from "@presentation/protocols/middleware";
import { NextFunction, Request, Response } from "express";

export const adaptMiddleware = (middleware: Middleware) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const request = {
			accessToken: req?.headers?.["x-access-token"],
			...(req?.headers || {}),
		};
		const httpResponse = await middleware.handle(request);
		if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
			Object.assign(req, httpResponse.body);
			next();
		} else {
			res.status(httpResponse.statusCode).json({
				error: httpResponse.body.error,
			});
		}
	};
};
