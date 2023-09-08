export interface IAddAccount {
	add: (account: IAccount) => Promise<boolean>;
}

export interface IAccount {
	name: string;
	email: string;
	password: string;
}
