import { IAddAccountRepository } from "../../../data/protocols/db/add-account-repository";
import { IUpdateAccessTokenRepository } from "../../../data/protocols/db/update-access-token-repository";
import { ILoadAccountByEmailRepository } from "../../../data/protocols/db/load-account-by-email-repository";
import { IAddAccountModel } from "../../../domain/usecases/add-account";

import { IAccountModel } from "../../../domain/models/account";
import { MongoHelper } from "./mongo-helper";

export class AccountMongoRepository
	implements
		IAddAccountRepository,
		ILoadAccountByEmailRepository,
		IUpdateAccessTokenRepository
{
	constructor() {}
	async loadByEmail(email: string): Promise<IAccountModel | null> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const account = await accountCollection.findOne(
			{
				email,
			},
			{
				projection: {
					_id: 1,
					name: 1,
					password: 1,
				},
			}
		);
		return account && MongoHelper.map(account);
	}
	updateAccessToken(id: string, token: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	async add(account: IAddAccountModel): Promise<boolean> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const insertedId =
			accountCollection && (await accountCollection.insertOne(account));

		return insertedId !== null;
	}
}
