import {
	IDbAddAccount,
	IAddAccountModel,
	IAddAccountRepository,
	ICheckAccountByEmail,
	IHasher,
} from "./db-add-account-protocols";

export class DbAddAccount implements IDbAddAccount {
	constructor(
		private readonly addAccountRepository: IAddAccountRepository,
		private readonly hasher: IHasher,
		private readonly checkAccountByEmailRepository: ICheckAccountByEmail
	) {}

	async add(account: IAddAccountModel): Promise<boolean> {
		const alreadyInUseAccount =
			await this.checkAccountByEmailRepository.checkByEmail(
				account.email
			);

		let isValid = false;
		if (!alreadyInUseAccount) {
			const hashedPassword = await this.hasher.hash(account.password);

			isValid = await this.addAccountRepository.add(
				Object.assign({ ...account, password: hashedPassword })
			);
		}
		return isValid;
	}
}
