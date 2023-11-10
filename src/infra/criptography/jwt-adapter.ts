import { IDecrypter } from "@/data/protocols/criptography/decrypter";
import { IEncrypter } from "@/data/protocols/criptography/encrypter";
import jwt from "jsonwebtoken";

export class JwtAdapter implements IEncrypter, IDecrypter {
	constructor(private readonly secret: string) {}

	async encrypt(plaintext: string): Promise<string> {
		return jwt.sign({ id: plaintext }, this.secret);
	}
	async decrypt(ciphertext: string): Promise<string> {
		return jwt.verify(ciphertext, this.secret) as any;
	}
}
