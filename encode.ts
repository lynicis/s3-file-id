import { randomUUID } from "node:crypto";

/**
 *
 * Replace unsafe chars and trim whitespaces
 *
 * @param {string} filename
 * @returns {string} // sanitized file name
 */
function _sanitizeFilename(fileName: string): string {
  return fileName
    .replace(/[\\/:*?"<>|\p{Cc}]/gu, "_")
    .trim();
}

/**
 * Encodes a filename into a unique file ID
 *
 * This function takes a filename and generates a unique file ID by:
 * 1. Sanitizing the filename
 * 2. Appending a random UUID
 * 3. Base64 encoding the combined string
 * 4. Prefixing with 'tmp_' for temporary file tracking
 *
 * The resulting file ID format is: "tmp_<base64-encoded-string>" where the
 * base64 string contains "<sanitized-filename>|<uuid>"
 *
 * @param {string} file - The filename to encode
 * @param {string} prefix - The prefix to use for the file ID (default: "tmp")
 * @returns {string} The encoded file ID, or false if encoding fails
 * @throws {Error}
 * @example
 * try {
 *    encode("test.txt") // Returns "tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg="
 * } catch (error) {
 *    // Handle error right here
 * }
 */
export default function encode(file: string, prefix = "tmp") : string {
  const sanitized = _sanitizeFilename(file);
  const uuid = randomUUID();
  const combined = `${sanitized}|${uuid}`;
  const base64 = Buffer.from(combined, "utf8").toString("base64");
  return `${prefix}_${base64}`;
}
