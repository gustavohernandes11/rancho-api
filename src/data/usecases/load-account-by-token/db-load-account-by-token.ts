import {
	IDbLoadAccountByToken,
	IDecrypter,
	ILoadAccountByTokenRepository,
	AccountId,
} from "./db-load-account-by-token-protocols";

export class DbLoadAccountByToken implements IDbLoadAccountByToken {
	constructor(
		private readonly decrypter: IDecrypter,
		private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
	) {}
	async load(accessToken: string, role?: string): Promise<AccountId | null> {
		let token: string;
		try {
			token = await this.decrypter.decrypt(accessToken);
		} catch (error) {
			return null;
		}
		if (token) {
			const account = await this.loadAccountByTokenRepository.loadByToken(
				accessToken,
				role
			);
			if (account) {
				return account;
			}
		}
		return null;
	}
}
