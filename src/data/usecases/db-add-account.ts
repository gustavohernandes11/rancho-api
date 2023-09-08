import { IAccount, IAddAccount } from "../../domain/usecases/add-account";
import { IAddAccountRepository } from "../protocols/add-account-repository";

export class DbAddAccount implements IAddAccount {
	constructor(private readonly addAccountRepository: IAddAccountRepository) {}

	async add(account: IAccount): Promise<boolean> {
		const success = await this.addAccountRepository.add(account);
		return new Promise((resolve) => resolve(true));
	}
}
