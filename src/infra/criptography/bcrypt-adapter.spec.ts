import { BcryptAdapter } from "./bcrypt-adapter";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
	async hash(): Promise<string> {
		return "hash";
	},
	async compare(): Promise<boolean> {
		return true;
	},
}));

describe("Bcrypt Adapter", () => {
	describe("hash()", () => {
		it("should use the correct params", () => {
			const sut = new BcryptAdapter(12);
			const bcryptSpy = jest.spyOn(bcrypt, "hash");
			sut.hash("any_text");
			expect(bcryptSpy).toHaveBeenCalledWith("any_text", 12);
		});
		it("should return a valid hash value", async () => {
			const sut = new BcryptAdapter(12);
			jest.spyOn(bcrypt, "hash");
			const response = await sut.hash("any_text");
			expect(response).toBe("hash");
		});
		it("should throw if bcrypt throws", async () => {
			const sut = new BcryptAdapter(12);
			const bcryptSpy = jest.spyOn(bcrypt, "hash");
			bcryptSpy.mockImplementationOnce(() => {
				throw new Error();
			});
			const promise = sut.hash("any_text");
			expect(promise).rejects.toThrow();
		});
	});
});
