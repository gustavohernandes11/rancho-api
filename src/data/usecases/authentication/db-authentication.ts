import {
	IAuthentication,
	IAuthenticationModel,
	IAuthenticationResult,
} from "../../../domain/usecases/authentication";
import { IEncrypter } from "../../protocols/criptography/encrypter";
import { IHashComparer } from "../../protocols/criptography/hash-comparer";
import { ILoadAccountByEmailRepository } from "../add-account/db-add-account-protocols";

export class DbAuthentication implements IAuthentication {
	constructor(
		private readonly loadByEmailRepo: ILoadAccountByEmailRepository,
		private readonly hasherComparer: IHashComparer,
		private readonly encrypter: IEncrypter
	) {}

	async auth(
		authentication: IAuthenticationModel
	): Promise<IAuthenticationResult> {
		const account = await this.loadByEmailRepo.loadByEmail(
			authentication.email
		);
		if (account) {
			const isValid = await this.hasherComparer.compare(
				authentication.password,
				account.password
			);
			if (isValid) {
				const accessToken = await this.encrypter.encrypt(account.id);
				return new Promise((resolve) =>
					resolve({ name: account.name, accessToken })
				);
			}
		}
		return new Promise((resolve) => resolve(null!));
	}
}

// get account in the database by email
// compare password with hash-comparer
// generate token
// save the token in the database
// return the token
