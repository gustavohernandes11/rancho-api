import { IAuthenticationModel } from "../models/authentication";

export interface IAuthentication {
	auth(account: IAuthenticationModel): Promise<IAuthenticationResult | null>;
}

export interface IAuthenticationResult {
	accessToken: string;
	name: string;
}
