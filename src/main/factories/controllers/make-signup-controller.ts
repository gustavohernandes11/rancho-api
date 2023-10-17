import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-mongo-repository";
import { SigunUpController } from "../../../presentation/controllers/signup";
import { IController } from "../../../presentation/protocols";
import { makeSignUpValidation } from "../validation/make-signup-validation";

export const makeSignupController = (): IController => {
	const validations = makeSignUpValidation();
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
	return new SigunUpController(
		validations,
		accountMongoRepoisitory,
		authentication
	);
};
