export interface IDbAddAccount {
	add: (account: IAddAccountModel) => Promise<boolean>;
}

export interface IAddAccountModel {
	name: string;
	email: string;
	password: string;
}
