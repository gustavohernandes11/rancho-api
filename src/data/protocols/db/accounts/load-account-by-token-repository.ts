export interface ILoadAccountByTokenRepository {
	loadByToken(token: string, role?: string): Promise<AccountId | null>;
}
export type AccountId = { id: string };
