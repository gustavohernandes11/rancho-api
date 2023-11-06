import { AuthMiddleware } from "@presentation/middlewares/auth-middleware";
import { makeDbLoadAccountByToken } from "../usecases/make-db-load-account-by-token";

export const makeAuthMiddleware = (role?: string) => {
	return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
