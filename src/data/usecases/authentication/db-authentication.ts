import {
	IAuthentication,
	IAuthenticationModel,
	IAuthenticationResult,
} from "../../../domain/usecases/authentication";
import { IHashComparer } from "../../protocols/criptography/hash-comparer";
import { ILoadAccountByEmailRepository } from "../add-account/db-add-account-protocols";

export class DbAuthentication implements IAuthentication {
	constructor(
		private readonly loadByEmailRepo: ILoadAccountByEmailRepository,
		private readonly hasherComparer: IHashComparer
	) {}

	async auth(
		authentication: IAuthenticationModel
	): Promise<IAuthenticationResult> {
		const account = await this.loadByEmailRepo.loadByEmail(
			authentication.email
		);
		if (account) {
			this.hasherComparer.compare(
				authentication.password,
				account.password
			);

			return new Promise((resolve) =>
				resolve({ name: "", accessToken: "" })
			);
		}
		return new Promise((resolve) => resolve(null!));
	}
}

// get account in the database by email
// compare password with hash-comparer
// generate token
// save the token in the database
// return the token
