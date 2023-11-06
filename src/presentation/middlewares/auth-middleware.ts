import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden, ok, serverError } from "../helpers/http-helpers";
import { IHttpResponse } from "../protocols";
import { Middleware } from "../protocols/middleware";
import { IDbLoadAccountByToken } from "@domain/usecases/load-account-by-token";

export class AuthMiddleware implements Middleware<AuthMiddlewareRequest> {
	constructor(
		private readonly dbLoadAccountByToken: IDbLoadAccountByToken,
		private readonly role?: string
	) {}
	async handle(request: AuthMiddlewareRequest): Promise<IHttpResponse> {
		try {
			const { accessToken } = request;
			if (accessToken) {
				const account = await this.dbLoadAccountByToken.load(
					accessToken,
					this.role
				);
				if (account) return ok({ accountId: account.id });
			}
			return forbidden(new AccessDeniedError());
		} catch (error) {
			return serverError();
		}
	}
}

interface AuthMiddlewareRequest {
	accessToken?: string;
}
