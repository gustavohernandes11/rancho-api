import { AccountId } from "@/data/protocols/db/accounts";

export interface IDbLoadAccountByToken {
	load(token: string, role?: string): Promise<AccountId | null>;
}
