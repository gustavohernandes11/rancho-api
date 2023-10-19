import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository";
import { SigunUpController } from "../../../presentation/controllers/signup";
import { IController } from "../../../presentation/protocols";
import { makeSignUpValidation } from "../validation/make-signup-validation";
import env from "../../config/env";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";

export const makeSignupController = (): IController => {
	const validations = makeSignUpValidation();
	const accountMongoRepoisitory = new AccountMongoRepository();
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const authentication = new DbAuthentication(
		accountMongoRepoisitory,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepoisitory
	);
	const dbAddAccount = new DbAddAccount(
		accountMongoRepoisitory,
		bcryptAdapter,
		accountMongoRepoisitory
	);
	return new SigunUpController(validations, dbAddAccount, authentication);
};
