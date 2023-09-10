import { IAccountModel } from "../models/account";

export interface IAddAccount {
	add: (account: IAddAccountModel) => Promise<IAccountModel | null>;
}

export interface IAddAccountModel {
	name: string;
	email: string;
	password: string;
}
