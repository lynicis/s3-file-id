/**
 * Validates if a string is a valid file id
 *
 * This function checks if a given string is a valid file id by:
 * 1. Ensuring it starts with the 'tmp_' prefix
 * 2. Base64 decoding the remaining string
 * 3. Validating it contains exactly one '|' separator
 * 4. Checking the UUID portion is exactly 36 characters
 *
 * @param {string} fileId - The file ID string to validate
 * @returns {true | Error} True if valid file ID format, Error otherwise
 * @example
 * isValid("tmp_dGVzdC50eHR8YWJjZGVmMTIzNDU2Nzg=") // Returns true
 * isValid("invalid-id") // Returns Error
 */
export default function isValid(fileId: string): boolean | Error {
  if (!fileId.startsWith("tmp_")) {
    return new Error("invalid prefix or filename");
  }

  const base64Payload = fileId.slice(4);
  let decoded;
  try {
    decoded = Buffer.from(base64Payload, "base64").toString("utf8");
  } catch (error) {
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
