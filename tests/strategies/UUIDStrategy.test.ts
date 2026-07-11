import { describe, it, expect } from "bun:test";
import { UUIDStrategy } from "../../strategies/UUIDStrategy";

describe("UUIDStrategy", () => {
  const strategy = new UUIDStrategy();

  describe("encode", () => {
    it("should return a base64 string containing filename and UUID", () => {
      const result = strategy.encode("test.txt");
      const decoded = Buffer.from(result, "base64").toString();
      expect(decoded).toMatch(/^test\.txt\|[a-f0-9-]{36}$/);
    });

    it("should add prefix when provided", () => {
      const result = strategy.encode("test.txt", "tmp");
      expect(result.startsWith("tmp_")).toBe(true);
    });

    it("should not add prefix when false", () => {
      const result = strategy.encode("test.txt", false);
      const withoutPrefix = result;
      expect(Buffer.from(withoutPrefix, "base64").toString()).toMatch(/\|/);
    });

    it("should sanitize filename special chars", () => {
      const result = strategy.encode("test:*?.txt");
      const decoded = Buffer.from(result, "base64").toString();
      expect(decoded.startsWith("test___.txt|")).toBe(true);
    });
  });

  describe("decode", () => {
    it("should return original filename", () => {
      const encoded = strategy.encode("test.txt");
      expect(strategy.decode(encoded)).toBe("test.txt");
    });

    it("should decode with prefix", () => {
      const encoded = strategy.encode("test.txt", "tmp");
      expect(strategy.decode(encoded)).toBe("test.txt");
    });
  });

  describe("isValid", () => {
    it("should return true for valid encoded string", () => {
      const encoded = strategy.encode("test.txt");
      expect(strategy.isValid(encoded)).toBe(true);
    });

    it("should return true for valid encoded string with prefix", () => {
      const encoded = strategy.encode("test.txt", "tmp");
      expect(strategy.isValid(encoded)).toBe(true);
    });

    it("should return Error for invalid string", () => {
      expect(strategy.isValid("invalid-id")).toBeInstanceOf(Error);
    });

    it("should return Error for empty string", () => {
      expect(strategy.isValid("")).toBeInstanceOf(Error);
    });

    it("should return Error when UUID part is not 36 chars", () => {
      const fake = Buffer.from("test.txt|tooshort").toString("base64");
      expect(strategy.isValid(fake)).toBeInstanceOf(Error);
    });
  });
});
