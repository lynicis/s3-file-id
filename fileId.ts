import type { IIdStrategy } from "./strategies/IIdStrategy";
import { UUIDStrategy } from "./strategies/UUIDStrategy";

const _defaultStrategy = new UUIDStrategy();

/**
 * FileId is a unique identifier for a file.
 * Supports pluggable ID generation strategies (UUIDStrategy, SnowflakeStrategy, etc.)
 *
 * @public
 * @class
 * @example
 * // Default (UUID strategy, backward compat)
 * const fileId = new FileId("test.txt");
 * const prefixed = new FileId("test.txt", "tmp");
 *
 * // Snowflake strategy
 * const sf = new FileId("test.txt", false, new SnowflakeStrategy({ workerId: 1 }));
 */
export default class FileId {
  public readonly id: string;

  constructor(
    filename: string,
    private readonly prefix: string | false = false,
    private readonly strategy: IIdStrategy = _defaultStrategy
  ) {
    this.id = this.strategy.encode(filename, this.prefix);
    Object.setPrototypeOf(this, FileId.prototype);
  }

  /**
   * Decode the file id to get the original filename
   *
   * CAUTION: Validate with isValid() before calling this.
   *
   * @returns {string | undefined} The original filename
   */
  decode(): string | undefined {
    return this.strategy.decode(this.id);
  }

  /**
   * Check if the file id is valid (uses UUIDStrategy validation)
   *
   * @param {unknown} fileId
   * @returns {boolean | Error}
   * @example
   * FileId.isValid(new FileId("test.txt"))       // true
   * FileId.isValid("tmp_dGVzdC50eHR8...")        // true | Error
   * FileId.isValid(null)                          // false
   */
  static isValid(fileId: unknown): boolean | Error {
    if (fileId instanceof FileId) return true;
    if (typeof fileId === "string") return _defaultStrategy.isValid(fileId);
    return false;
  }
}
