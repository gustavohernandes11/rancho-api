import { IHashComparer } from "../../data/protocols/criptography/hash-comparer";
import { IHasher } from "../../data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

export class BcryptAdapter implements IHasher, IHashComparer {
	constructor(private readonly salt: number) {}
	async hash(text: string): Promise<string> {
		return await bcrypt.hash(text, this.salt);
	}
	compare(plaintext: string, digest: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
