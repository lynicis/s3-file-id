import { UUIDStrategy } from "./strategies/UUIDStrategy";

const _strategy = new UUIDStrategy();

/**
 * Validates if a string is a valid UUID-strategy file ID.
 *
 * @param {string} fileId - The file ID string to validate
 * @returns {true | Error} True if valid, Error otherwise
 */
export default function isValid(fileId: string): boolean | Error {
  return _strategy.isValid(fileId);
}
