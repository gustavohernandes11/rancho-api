import { IHashComparer } from "@data/protocols/criptography/hash-comparer";
import { IHasher } from "@data/protocols/criptography/hasher";
import bcrypt from "bcrypt";

export class BcryptAdapter implements IHasher, IHashComparer {
	constructor(private readonly salt: number) {}
	async hash(text: string): Promise<string> {
		return await bcrypt.hash(text, this.salt);
	}
	async compare(plaintext: string, digest: string): Promise<boolean> {
		return await bcrypt.compare(plaintext, digest);
	}
}
