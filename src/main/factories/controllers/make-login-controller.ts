import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository";
import { LoginController } from "../../../presentation/controllers/login";
import { IController } from "../../../presentation/protocols";
import { makeLoginValidations } from "../validation/make-login-validation";

export const makeLoginController = (): IController => {
	const validation = makeLoginValidations();
	const accountMongoRepoisitory = new AccountMongoRepository();
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET!);
	const authentication = new DbAuthentication(
		accountMongoRepoisitory,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepoisitory
	);
	return new LoginController(validation, authentication);
};
