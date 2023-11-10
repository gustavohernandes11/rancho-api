import { MongoHelper } from "./mongo-helper";
import { ObjectId } from "mongodb";
import { AccountId } from "@/data/protocols/db/accounts/load-account-by-token-repository";
import {
	IAddAccountRepository,
	ICheckAccountByEmail,
	ICheckAccountByIdRepository,
	ILoadAccountByEmailRepository,
	ILoadAccountByTokenRepository,
	IUpdateAccessTokenRepository,
} from "@/data/protocols/db/accounts";
import { IAddAccountModel } from "@/domain/usecases/add-account";
import { IAccountModel } from "@/domain/models/account";
import { parseToObjectId } from "./utils/parse-to-object-id";

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

		const account = await accountCollection.findOne({
			_id: parseToObjectId(id),
		});

		return account !== null;
	}
	async add(account: IAddAccountModel): Promise<boolean> {
		const accountCollection = MongoHelper.getCollection("accounts");
		const { acknowledged } =
			accountCollection && (await accountCollection.insertOne(account));

		return acknowledged;
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
