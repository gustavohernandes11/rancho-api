import {
	IAuthentication,
	IAuthenticationModel,
	IAuthenticationResult,
	IEncrypter,
	IHashComparer,
	ILoadAccountByEmailRepository,
	IUpdateAccessTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements IAuthentication {
	constructor(
		private readonly loadByEmailRepo: ILoadAccountByEmailRepository,
		private readonly hasherComparer: IHashComparer,
		private readonly encrypter: IEncrypter,
		private readonly updateAccessTokenRespository: IUpdateAccessTokenRepository
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
				await this.updateAccessTokenRespository.updateAccessToken(
					account.id,
					accessToken
				);
				return new Promise((resolve) =>
					resolve({ name: account.name, accessToken })
				);
			}
		}
		return new Promise((resolve) => resolve(null!));
	}
}
