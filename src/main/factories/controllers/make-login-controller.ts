import { DbAuthentication } from "@data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "@infra/criptography/bcrypt-adapter";
import { JwtAdapter } from "@infra/criptography/jwt-adapter";
import { AccountMongoRepository } from "@infra/db/mongodb/account-mongo-repository";
import { LoginController } from "@presentation/controllers/account/login-controller";
import { IController } from "@presentation/protocols";
import env from "../../config/env";
import { makeLoginValidations } from "../validation/make-login-validation";

export const makeLoginController = (): IController => {
	const validation = makeLoginValidations();
	const accountMongoRepository = new AccountMongoRepository();
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);
	return new LoginController(validation, dbAuthentication);
};
