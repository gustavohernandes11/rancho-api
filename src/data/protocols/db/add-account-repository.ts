import { IAddAccountModel } from "../../../domain/usecases/add-account";

export interface IAddAccountRepository {
	add(account: IAddAccountModel): Promise<boolean>;
}
