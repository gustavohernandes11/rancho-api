import { IAddAccountRepository } from "../../../data/protocols/db/accounts/add-account-repository";
import { IUpdateAccessTokenRepository } from "../../../data/protocols/db/update-access-token-repository";
import { ILoadAccountByEmailRepository } from "../../../data/protocols/db/accounts/load-account-by-email-repository";
import { IAddAccountModel } from "../../../domain/usecases/add-account";
import { IAccountModel } from "../../../domain/models/account";
import { MongoHelper } from "./mongo-helper";
import { ObjectId } from "mongodb";
import { ICheckAccountByEmail } from "../../../data/protocols/db/accounts/check-account-by-email-repository";
import {
	AccountId,
	ILoadAccountByTokenRepository,
} from "../../../data/protocols/db/accounts/load-account-by-token-repository";
import { ICheckAccountByIdRepository } from "../../../data/protocols/db/accounts/check-account-by-id-repository";

export class AccountMongoRepository
	implements
		IAddAccountRepository,
		ILoadAccountByEmailRepository,
		IUpdateAccessTokenRepository,
		ICheckAccountByEmail,
		ICheckAccountByIdRepository,
		ILoadAccountByTokenRepository
{
	constructor() {}
	async checkByEmail(email: string): Promise<boolean> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const account = await accountCollection.findOne(
			{
				email,
			},
			{
				projection: {
					_id: 1,
				},
			}
		);
		return account !== null;
	}

	async checkById(id: ObjectId | string): Promise<boolean> {
		const accountCollection = MongoHelper.getCollection("accounts");

		let objectId;
		if (typeof id === "string") {
			try {
				objectId = new ObjectId(id);
			} catch (_) {
				return false;
			}
		} else {
			objectId = id;
		}

		const account = await accountCollection.findOne({
			_id: objectId,
		});

		return account !== null;
	}
	async add(account: IAddAccountModel): Promise<boolean> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const insertedId =
			accountCollection && (await accountCollection.insertOne(account));

		return insertedId !== null;
	}
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
	async updateAccessToken(
		id: string | ObjectId,
		token: string
	): Promise<void> {
		const accountCollection = MongoHelper.getCollection("accounts");

		await accountCollection.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					accessToken: token,
				},
			}
		);
	}

	async loadByToken(
		token: string,
		role?: string | undefined
	): Promise<AccountId | null> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const account = await accountCollection.findOne(
			{
				accessToken: token,
				$or: [{ role }, { role: "admin" }],
			},
			{
				projection: {
					_id: 1,
				},
			}
		);
		return account && MongoHelper.map(account);
	}
}
