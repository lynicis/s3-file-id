import { describe, it, expect } from "bun:test";
import FileId from "../fileId";
import encode from "../encode";

describe("FileId", () => {
  describe("edge cases", () => {
    it("should sanitize filename with control characters", () => {
      const filename = "test\n\r\tfile.txt";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe("test___file.txt");
    });

    it("should handle filename with only extension", () => {
      const filename = ".txt";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe(filename);
    });

    it("should handle filename without extension", () => {
      const filename = "testfile";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe(filename);
    });

    it("should handle filename with very long extension", () => {
      const filename = "test." + "a".repeat(100);
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe(filename);
    });

    it("should sanitize special characters", () => {
      const filename = "test:*?<>|.txt";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe("test______.txt");
    });
  });
  describe("constructor", () => {
    it("should create a new FileId instance", () => {
      const filename = "test.txt";
      const fileId = new FileId(filename);

      expect(fileId).toBeDefined();
      expect(typeof fileId.id).toBe("string");
      expect(fileId.id.startsWith("tmp_")).toBe(true);
    });

    it("should handle filename with special characters", () => {
      const filename = "test@#$%^&*.txt";
      const fileId = new FileId(filename);
      expect(fileId).toBeDefined();
      expect(fileId.decode()).toBe("test@#$%^&_.txt");
    });

    it("should handle very long filename", () => {
      const filename = "a".repeat(255) + ".txt";
      const fileId = new FileId(filename);
      expect(fileId).toBeDefined();
      expect(fileId.decode()).toBe(filename);
    });

    it("should handle filename with spaces", () => {
      const filename = "my test file.txt";
      const fileId = new FileId(filename);
      expect(fileId).toBeDefined();
      expect(fileId.decode()).toBe(filename);
    });
  });

  describe("decode", () => {
    it("should decode a valid file id", () => {
      const filename = "test.txt";
      const fileId = new FileId(filename);
      const decoded = fileId.decode();

      expect(decoded).toBe(filename);
    });

    it("should preserve case sensitivity in decoded filename", () => {
      const filename = "TestFile.TXT";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe(filename);
    });

    it("should handle filenames with multiple dots", () => {
      const filename = "test.backup.tar.gz";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe(filename);
    });

    it("should handle filenames with unicode characters", () => {
      const filename = "测试文件.txt";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe(filename);
    });

    it("should handle filenames with path-like characters", () => {
      const filename = "file/with\\path-chars.txt";
      const fileId = new FileId(filename);
      expect(fileId.decode()).toBe("file_with_path-chars.txt");
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

    it("should return error for invalid file id", () => {
      expect(FileId.isValid("invalid-filename")).toBeInstanceOf(Error);
    });

    it("should handle null input", () => {
      expect(FileId.isValid(null)).toBe(false);
    });

    it("should handle undefined input", () => {
      expect(FileId.isValid(undefined)).toBe(false);
    });

    it("should reject empty string", () => {
      expect(FileId.isValid("")).toBeInstanceOf(Error);
    });

    it("should reject malformed tmp_ prefix", () => {
      expect(FileId.isValid("tmpx_something")).toBeInstanceOf(Error);
    });

    it("should reject object without proper FileId structure", () => {
      const fakeFileId = { id: "tmp_something" };
      expect(FileId.isValid(fakeFileId)).toBe(false);
    });
  });
});
