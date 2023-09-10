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

	async add(account: IAddAccountModel): Promise<IAccountModel> {
		const alreadyUsedAccount =
			this.loadAccountByEmailRepository.loadByEmail(account.email);

		const encryptedPassword = await this.encrypter.encrypt(
			account.password
		);

		const insertedAccount = await this.addAccountRepository.add(
			Object.assign(account, { password: encryptedPassword })
		);

		if (!insertedAccount) {
			return new Promise((_, reject) => reject(false));
		}

		return new Promise((resolve) => resolve(insertedAccount));
	}
}
