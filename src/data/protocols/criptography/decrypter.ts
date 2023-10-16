export interface IDecrypter {
	decrypt(plaintext: string): Promise<string>;
}
