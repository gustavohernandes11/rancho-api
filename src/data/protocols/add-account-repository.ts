import { IAccountModel } from "../../domain/models/account";
import { IAccount } from "../../domain/usecases/add-account";

export interface IAddAccountRepository {
	add(account: IAccount): Promise<IAccountModel>;
}
