export interface IEncrypter {
	encrypt(text: string): Promise<string>;
}
