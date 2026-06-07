/**
 * Decodes a file ID to extract the original filename
 *
 * This function takes an encoded file ID and decodes it to retrieve the original filename.
 * The file ID can be in one of two formats:
 * - With prefix: "<prefix>_<base64-encoded-string>" (e.g., "tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=")
 * - Without prefix: "<base64-encoded-string>" (e.g., "dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=")
 * The base64 string contains the filename and a UUID separator.
 *
 * CAUTION:
 * This function does not validate the input. It is the caller's responsibility to ensure
 * that the input is a valid file ID by using the isValid() function first.
 * Invalid file IDs will cause errors or return unexpected results.
 *
 * @param {string} fileId - The encoded file ID to decode
 * @returns {string} The original filename extracted from the file ID
 * @throws {Error} If the fileId is invalid or cannot be decoded properly
 * @example
 * decode("tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=") // Returns "test.txt"
 * decode("dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=") // Returns "test.txt"
 */
export default function decode(fileId: string): string | undefined {
  if (fileId.includes("_")) {
    fileId = fileId.substring(fileId.indexOf("_") + 1);
  }
  return Buffer.from(fileId, "base64").toString().split("|")[0];
}
