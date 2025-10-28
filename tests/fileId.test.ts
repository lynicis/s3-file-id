import { describe, it, expect } from "bun:test";
import FileId from "../fileId";
import encode from "../encode";

describe("FileId", () => {
  describe("constructor", () => {
    it("should create a new FileId instance", () => {
      const filename = "test.txt";
      const fileId = new FileId(filename);

      expect(fileId).toBeDefined();
      expect(typeof fileId.id).toBe("string");
      expect(fileId.id.startsWith("tmp_")).toBe(true);
    });
  });

  describe("decode", () => {
    it("should decode a valid file id", () => {
      const filename = "test.txt";
      const fileId = new FileId(filename);
      const decoded = fileId.decode();

      expect(decoded).toBe(filename);
    });
  });

  describe("isValid", () => {
    it("should return true for valid FileId instance", () => {
      const fileId = new FileId("test.txt");
      expect(FileId.isValid(fileId)).toBe(true);
    });

    it("should return true for valid encoded string", () => {
      const encoded = encode("test.txt");
      expect(FileId.isValid(encoded)).toBe(true);
    });

    it("should return false for invalid file id", () => {
      expect(FileId.isValid("invalid-filename")).toBeInstanceOf(Error);
    });
  });
});
