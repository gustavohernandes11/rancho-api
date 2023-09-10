import { IAccountModel } from "../models/account";

export interface IAddAccount {
	add: (account: IAddAccountModel) => Promise<IAccountModel>;
}

export interface IAddAccountModel {
	name: string;
	email: string;
	password: string;
}
