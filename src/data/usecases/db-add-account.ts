import {
	IAccountModel,
	IAddAccount,
	IAddAccountModel,
	IAddAccountRepository,
	IHasher,
	ILoadAccountByEmailRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {
	constructor(
		private readonly addAccountRepository: IAddAccountRepository,
		private readonly hasher: IHasher,
		private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
	) {}

	async add(account: IAddAccountModel): Promise<boolean> {
		const alreadyInUseAccount =
			await this.loadAccountByEmailRepository.loadByEmail(account.email);

		if (alreadyInUseAccount && alreadyInUseAccount !== null)
			return new Promise((resolve) => resolve(false));

		const hashedPassword = await this.hasher.hash(account.password);
		await this.addAccountRepository.add(
			Object.assign(account, { password: hashedPassword })
		);
		return new Promise((resolve) => resolve(true));
	}
}
