import { IAccountModel } from "../../domain/models/account";
import {
	IAddAccountModel,
	IAddAccount,
} from "../../domain/usecases/add-account";
import { IAddAccountRepository } from "../protocols/add-account-repository";
import { IHasher } from "../protocols/hasher";
import { ILoadAccountByEmailRepository } from "../protocols/load-account-by-email-repository";

export class DbAddAccount implements IAddAccount {
	constructor(
		private readonly addAccountRepository: IAddAccountRepository,
		private readonly hasher: IHasher,
		private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
	) {}

	async add(account: IAddAccountModel): Promise<IAccountModel | null> {
		const alreadInUseAccount =
			await this.loadAccountByEmailRepository.loadByEmail(account.email);

		if (alreadInUseAccount === null) {
			const hashedPassword = await this.hasher.hash(account.password);
			const insertedAccount = await this.addAccountRepository.add(
				Object.assign(account, { password: hashedPassword })
			);
			return new Promise((resolve) => resolve(insertedAccount));
		}

		return new Promise((resolve) => resolve(null));
	}
}
