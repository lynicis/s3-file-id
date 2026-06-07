/**
 * Validates if a string is a valid file id
 *
 * This function checks if a given string is a valid file id by:
 * 1. Checking for 'tmp_' prefix (optional) and stripping it if present
 * 2. Base64 decoding the remaining string
 * 3. Validating it contains exactly one '|' separator
 * 4. Checking the UUID portion is exactly 36 characters
 *
 * Both formats are accepted:
 * - With prefix: "tmp_<base64-encoded-string>"
 * - Without prefix: "<base64-encoded-string>"
 *
 * @param {string} fileId - The file ID string to validate
 * @returns {true | Error} True if valid file ID format, Error otherwise
 * @example
 * isValid("dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=") // Returns true
 * isValid("tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=") // Returns true
 * isValid("invalid-id") // Returns Error
 */
export default function isValid(fileId: string): boolean | Error {
  let payload = fileId;
  if (fileId.includes("_")) {
    payload = fileId.substring(fileId.indexOf("_") + 1);
  }

  let decoded;
  try {
    decoded = Buffer.from(payload, "base64").toString("utf8");
  } catch {
    return new Error("invalid base64 encoding");
  }

  const separatorIndex = decoded.indexOf("|");
  if (
    separatorIndex === -1 ||
    decoded.indexOf("|", separatorIndex + 1) !== -1
  ) {
    return new Error("invalid payload: must contain exactly one '|' separator");
  }

  const uuid = decoded.slice(separatorIndex + 1);
  if (uuid.length !== 36) {
    return new Error("invalid uuid part: must be 36 characters");
  }

  return true;
}
