export interface ICheckAccountByEmail {
	checkByEmail(email: string): Promise<boolean>;
}
