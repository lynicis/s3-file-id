import { randomUUID } from "crypto";

/**
 *
 * Replace unsafe chars and trim whitespaces
 *
 * @param {string} filename
 * @returns {string} // sanitized file name
 */
function _sanitizeFilename(fileName: string): string {
  return fileName.replace(/[\\/:*?"<>|\p{Cc}]/gu, "_").trim();
}

/**
 * Encodes a filename into a unique file ID
 *
 * This function takes a filename and generates a unique file ID by:
 * 1. Sanitizing the filename
 * 2. Appending a random UUID
 * 3. Base64 encoding the combined string
 * 4. Optionally prefixing with a custom prefix (default: no prefix)
 *
 * The resulting file ID format is:
 * - With prefix: "<prefix>_<base64-encoded-string>"
 * - Without prefix: "<base64-encoded-string>"
 * The base64 string contains "<sanitized-filename>|<uuid>"
 *
 * @param {string} file - The filename to encode
 * @param {string | false} prefix - The prefix to use for the file ID (default: false - no prefix)
 * @returns {string} The encoded file ID
 * @throws {Error}
 * @example
 * encode("test.txt") // Returns "dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg="
 * encode("test.txt", "tmp") // Returns "tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg="
 */
export default function encode(
  file: string,
  prefix: string | false = false
): string {
  const sanitized = _sanitizeFilename(file);
  const uuid = randomUUID();
  const combined = `${sanitized}|${uuid}`;
  const base64 = Buffer.from(combined, "utf8").toString("base64");
  return prefix ? `${prefix}_${base64}` : base64;
}
