import { DbLoadAccountByToken } from "@data/usecases/load-account-by-token/db-load-account-by-token";
import { JwtAdapter } from "@infra/criptography/jwt-adapter";
import { AccountMongoRepository } from "@infra/db/mongodb/account-mongo-repository";
import env from "@main/config/env";

export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
	const accountMongoRepository = new AccountMongoRepository();
	const decrypter = new JwtAdapter(env.jwtSecret);
	return new DbLoadAccountByToken(decrypter, accountMongoRepository);
};
