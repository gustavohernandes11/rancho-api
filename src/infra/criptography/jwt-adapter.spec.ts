import { JwtAdapter } from "./jwt-adapter";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
	async sign(): Promise<string> {
		return new Promise((resolve) => resolve("encrypted_text"));
	},
	async verify(): Promise<string> {
		return new Promise((resolve) => resolve("decrypted_text"));
	},
}));

describe("JWT Adapter", () => {
	describe("encrypt", () => {
		it("should call encrypt method with correct parameters", () => {
			const secret = "any_secret";
			const sut = new JwtAdapter(secret);
			const jwtSpy = jest.spyOn(sut, "encrypt");
			const text = "any_text";
			sut.encrypt(text);

			expect(jwtSpy).toHaveBeenCalledWith("any_text");
		});
		it("should return an encrypted text", async () => {
			const secret = "any_secret";
			const sut = new JwtAdapter(secret);
			const text = "any_text";
			const response = await sut.encrypt(text);

			expect(response).toBeTruthy();
		});
		it("should throw if encrypt throws", async () => {
			const secret = "any_secret";
			const sut = new JwtAdapter(secret);
			const encryptSpy = jest.spyOn(jwt, "sign");
			encryptSpy.mockImplementationOnce((): never => {
				throw new Error();
			});
			const promise = sut.encrypt("any_text");

			expect(promise).rejects.toThrow();
		});
	});
	describe("decrypt", () => {
		it("should call decrypt with correct values", async () => {
			const secret = "any_secret";
			const sut = new JwtAdapter(secret);
			const jwtSpy = jest.spyOn(sut, "decrypt");
			const text = "any_text";
			await sut.decrypt(text);

			expect(jwtSpy).toHaveBeenCalledWith("any_text");
			expect(jwtSpy).toHaveBeenCalled();
		});
		it("should return an encrypted value on success", async () => {
			const secret = "any_secret";
			const sut = new JwtAdapter(secret);
			const response = await sut.decrypt("any_text");

			expect(response).toBe("decrypted_text");
		});

		it("should throw if decrypt throws", () => {
			const secret = "any_secret";
			const sut = new JwtAdapter(secret);
			jest.spyOn(jwt, "verify").mockImplementationOnce(() => {
				throw new Error();
			});
			const promise = sut.decrypt("any_text");
			expect(promise).rejects.toThrow();
		});
	});
});
