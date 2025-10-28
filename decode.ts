/**
 * Decodes a file ID to extract the original filename
 *
 * This function takes an encoded file ID and decodes it to retrieve the original filename.
 * The file ID is expected to be in the format "tmp_<base64-encoded-string>" where the
 * base64 string contains the filename and a UUID separator.
 *
 * CAUTION:
 * This function does not validate the input. It is the caller's responsibility to ensure
 * that the input is a valid file ID by using the isValid() function first.
 * Invalid file IDs will cause errors or return unexpected results.
 *
 * @param {string} fileId - The encoded file ID to decode (e.g. "tmp_Zm9vLnR4dHxhYmNkZWYxMjM0NTY3OA==")
 * @returns {string} The original filename extracted from the file ID
 * @throws {Error} If the fileId is invalid or cannot be decoded properly
 * @example
 * decode("tmp_Zm9vLnR4dHxhYmNkZWYxMjM0NTY3OA==") // Returns "foo.txt"
 */
export default function decode(fileId: string): string | undefined {
  fileId = fileId.substring(4);
  return Buffer.from(fileId, "base64").toString().split("|")[0];
}

