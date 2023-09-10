import { IAccountModel } from "../../domain/models/account";
import {
	IAddAccountModel,
	IAddAccount,
} from "../../domain/usecases/add-account";
import { IAddAccountRepository } from "../protocols/add-account-repository";
import { IEncrypter } from "../protocols/encrypter";
import { ILoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";

export class DbAddAccount implements IAddAccount {
	constructor(
		private readonly addAccountRepository: IAddAccountRepository,
		private readonly encrypter: IEncrypter,
		private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
	) {}

	async add(account: IAddAccountModel): Promise<IAccountModel | null> {
		const alreadInUseAccount =
			await this.loadAccountByEmailRepository.loadByEmail(account.email);

		if (alreadInUseAccount !== null) {
			return new Promise((resolve) => resolve(null));
		}

		const encryptedPassword = await this.encrypter.encrypt(
			account.password
		);

		const insertedAccount = await this.addAccountRepository.add(
			Object.assign(account, { password: encryptedPassword })
		);

		return new Promise((resolve) => resolve(insertedAccount));
	}
}
