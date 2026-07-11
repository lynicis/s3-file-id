import { describe, it, expect, beforeEach } from "bun:test";
import { SnowflakeStrategy } from "../../strategies/SnowflakeStrategy";

describe("SnowflakeStrategy", () => {
  describe("constructor", () => {
    it("should use workerId=0 and datacenterId=0 when no options provided", () => {
      delete process.env.SNOWFLAKE_WORKER_ID;
      delete process.env.SNOWFLAKE_DATACENTER_ID;
      expect(() => new SnowflakeStrategy()).not.toThrow();
    });

    it("should prefer constructor options over env vars", () => {
      process.env.SNOWFLAKE_WORKER_ID = "5";
      const strategy = new SnowflakeStrategy({ workerId: 1 });
      expect(() => strategy.encode("test.txt")).not.toThrow();
      delete process.env.SNOWFLAKE_WORKER_ID;
    });

    it("should use env var when constructor option not provided", () => {
      process.env.SNOWFLAKE_WORKER_ID = "3";
      process.env.SNOWFLAKE_DATACENTER_ID = "2";
      expect(() => new SnowflakeStrategy()).not.toThrow();
      delete process.env.SNOWFLAKE_WORKER_ID;
      delete process.env.SNOWFLAKE_DATACENTER_ID;
    });

    it("should throw when workerId > 31", () => {
      expect(() => new SnowflakeStrategy({ workerId: 32 })).toThrow(
        "workerId must be between 0 and 31"
      );
    });

    it("should throw when workerId < 0", () => {
      expect(() => new SnowflakeStrategy({ workerId: -1 })).toThrow(
        "workerId must be between 0 and 31"
      );
    });

    it("should throw when datacenterId > 31", () => {
      expect(() => new SnowflakeStrategy({ datacenterId: 32 })).toThrow(
        "datacenterId must be between 0 and 31"
      );
    });

    it("should throw when datacenterId < 0", () => {
      expect(() => new SnowflakeStrategy({ datacenterId: -1 })).toThrow(
        "datacenterId must be between 0 and 31"
      );
    });
  });

  describe("encode", () => {
    let strategy: SnowflakeStrategy;

    beforeEach(() => {
      strategy = new SnowflakeStrategy({ workerId: 1, datacenterId: 1 });
    });

    it("should return base64 string with filename and numeric snowflake ID", () => {
      const result = strategy.encode("test.txt");
      const decoded = Buffer.from(result, "base64").toString();
      expect(decoded).toMatch(/^test\.txt\|\d{17,19}$/);
    });

    it("should add prefix when provided", () => {
      const result = strategy.encode("test.txt", "tmp");
      expect(result.startsWith("tmp_")).toBe(true);
    });

    it("should produce unique IDs on consecutive calls", () => {
      const ids = new Set(
        Array.from({ length: 10 }, () => strategy.encode("test.txt"))
      );
      expect(ids.size).toBe(10);
    });

    it("should sanitize filename", () => {
      const result = strategy.encode("test:*.txt");
      const decoded = Buffer.from(result, "base64").toString();
      expect(decoded.startsWith("test__.txt|")).toBe(true);
    });
  });

  describe("decode", () => {
    let strategy: SnowflakeStrategy;

    beforeEach(() => {
      strategy = new SnowflakeStrategy({ workerId: 1, datacenterId: 1 });
    });

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
    let strategy: SnowflakeStrategy;

    beforeEach(() => {
      strategy = new SnowflakeStrategy({ workerId: 1, datacenterId: 1 });
    });

    it("should return true for valid snowflake-encoded string", () => {
      const encoded = strategy.encode("test.txt");
      expect(strategy.isValid(encoded)).toBe(true);
    });

    it("should return true with prefix", () => {
      const encoded = strategy.encode("test.txt", "tmp");
      expect(strategy.isValid(encoded)).toBe(true);
    });

    it("should return Error for empty string", () => {
      expect(strategy.isValid("")).toBeInstanceOf(Error);
    });

    it("should return Error when ID part is not numeric", () => {
      const fake = Buffer.from("test.txt|not-a-number").toString("base64");
      expect(strategy.isValid(fake)).toBeInstanceOf(Error);
    });

    it("should return Error for UUID-format string (wrong strategy)", () => {
      const uuidFake = Buffer.from(
        "test.txt|550e8400-e29b-41d4-a716-446655440000"
      ).toString("base64");
      expect(strategy.isValid(uuidFake)).toBeInstanceOf(Error);
    });

    it("should return Error when no pipe separator", () => {
      const fake = Buffer.from("testfilename").toString("base64");
      expect(strategy.isValid(fake)).toBeInstanceOf(Error);
    });
  });
});
