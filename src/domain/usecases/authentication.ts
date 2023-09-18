export interface IAuthentication {
	auth(account: IAuthenticationModel): Promise<IAuthenticationResult | null>;
}

export interface IAuthenticationModel {
	email: string;
	password: string;
}

export interface IAuthenticationResult {
	accessToken: string;
	name: string;
}
