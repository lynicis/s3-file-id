import isValid  from "./isValid";
import encode from "./encode";
import decode from "./decode";

/**
 * FileId is a unique identifier for a file.
 * This class provides an object-oriented interface for working with file IDs,
 * encapsulating encoding, decoding and validation functionality.
 *
 * @public
 * @class
 * @example
 * const fileId = new FileId("test.txt");
 * if (FileId.isValid(fileId)) {
 *   const filename = fileId.decode();
 * }
 */
export default class FileId {
  readonly id: string;

  /**
   * Create a new FileId instance
   *
   * This constructor creates a new FileId instance by encoding the provided filename.
   * The encoded fileId will be stored internally and can be decoded later.
   *
   * @param {string} fileId - The filename to encode into a FileId
   * @returns {FileId} A new FileId instance containing the encoded filename
   * @example
   * const fileId = new FileId("test.txt")
   * console.log(fileId.fileId) // "tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg="
   */
  constructor(fileId: string) {
    this.id = encode(fileId);
    Object.setPrototypeOf(this, FileId.prototype);
  }

  /**
   * Decode the file id to get the original filename
   *
   * CAUTION:
   * This method should not be used without first validating the fileId using isValid().
   * Invalid fileIds may cause errors or unexpected behavior.
   *
   * @returns {string} The original filename
   * @throws {Error} If the fileId is invalid or cannot be decoded
   */
  decode(): string | undefined {
    return decode(this.id);
  }

  /**
   * Check if the file id is valid
   * Same as isValid function
   *
   * @param {string} fileId
   * @returns {boolean}
   * @example
   * FileId.isValid("tmp_Zm9vLnR4dHxhYmNkZWYxMjM0NTY3OA==") // true
   * FileId.isValid("invalid-id") // false
   */
  static isValid(fileId: any): boolean | Error {
    if (fileId instanceof FileId) return true;
    return isValid(fileId);
  }
}
